# import os
# import google_auth_oauthlib.flow
# import googleapiclient.discovery
# import googleapiclient.errors
# import pickle

# scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

# def get_youtube_client():
#     os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    
#     api_service_name = "youtube"
#     api_version = "v3"
#     client_secrets_file = r"""c:\Users\DELL\Downloads\client_secret.json"""  # Replace with your actual JSON file

#     credentials = None

#     # ✅ Load existing credentials if available
#     if os.path.exists("token.pkl"):
#         with open("token.pkl", "rb") as token:
#             credentials = pickle.load(token)

#     # ✅ If credentials are not available or expired, authenticate
#     if not credentials or not credentials.valid:
#         flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
#             client_secrets_file, scopes
#         )
#         credentials = flow.run_local_server(port=0)

#         # ✅ Save the new credentials for future use
#         with open("token.pkl", "wb") as token:
#             pickle.dump(credentials, token)

#     return googleapiclient.discovery.build(
#         api_service_name, api_version, credentials=credentials
#     )

# def get_related_videos(query, max_results=10):
#     youtube = get_youtube_client()
    
#     request = youtube.search().list(
#         part="snippet",
#         q=query,
#         type="video",
#         maxResults=max_results
#     )
#     response = request.execute()

#     video_links = [
#         f"https://www.youtube.com/watch?v={item['id']['videoId']}"
#         for item in response.get("items", [])
#     ]

#     return video_links

# if __name__ == "__main__":
#     query = input("Enter search query: ")
#     related_videos = get_related_videos(query)

#     print("\nRelated Video Links:")
#     for link in related_videos:
#         print(link)
import os
import google_auth_oauthlib.flow
import googleapiclient.discovery
import googleapiclient.errors
import pickle
import json
# Import necessary auth libraries
import google.auth.transport.requests
import google.auth.exceptions # To catch refresh errors specifically

scopes = ["https://www.googleapis.com/auth/youtube.readonly"]
token_file = "token.pkl"
# IMPORTANT: Replace with your actual client secrets file path
client_secrets_file = r"""c:\Users\DELL\Downloads\client_secret.json""" 

def get_youtube_client():
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1" # Usually for local testing only

    api_service_name = "youtube"
    api_version = "v3"

    credentials = None

    # Load existing credentials if available
    if os.path.exists(token_file):
        try:
            with open(token_file, "rb") as token:
                credentials = pickle.load(token)
        except (EOFError, pickle.UnpicklingError, ImportError, ModuleNotFoundError) as e:
             # Catch more potential errors during unpickling
            print(f"Warning: Could not load token from {token_file}. Error: {e}. Re-authenticating.")
            credentials = None # Force re-authentication

    # If credentials are not available or expired, authenticate
    # Check if credentials exist and are valid (and have the required scopes)
    if not credentials or not credentials.valid or not all(scope in credentials.scopes for scope in scopes):
        if credentials and credentials.expired and credentials.refresh_token:
            print("Credentials expired, attempting refresh...")
            try:
                # Create a Request object for the transport
                request_object = google.auth.transport.requests.Request()
                # Attempt to refresh the credentials
                credentials.refresh(request_object)
                print("Credentials refreshed successfully.")
                # --- IMPORTANT: Save the refreshed credentials ---
                with open(token_file, "wb") as token:
                    pickle.dump(credentials, token)
                print(f"Refreshed credentials saved to {token_file}")
                # -----------------------------------------------
            except google.auth.exceptions.RefreshError as e:
                print(f"Error refreshing token: {e}")
                print("Refresh failed. Deleting potentially invalid token and re-authenticating.")
                # If refresh fails, remove the old token file and force re-auth
                if os.path.exists(token_file):
                    try:
                        os.remove(token_file)
                    except OSError as oe:
                         print(f"Error removing token file {token_file}: {oe}")
                credentials = None # Force re-authentication
            except Exception as e:
                # Catch any other unexpected error during refresh
                print(f"An unexpected error occurred during token refresh: {e}")
                credentials = None # Force re-authentication

        # Proceed with full flow if no valid credentials after load/refresh attempt
        if not credentials or not credentials.valid:
            print("No valid credentials found or refresh failed, starting authentication flow...")
            flow = google_auth_oauthlib.flow.InstalledAppFlow.from_client_secrets_file(
                client_secrets_file, scopes
            )
            # port=0 lets it pick a random available port
            credentials = flow.run_local_server(port=0)

            # Save the new credentials for future use
            with open(token_file, "wb") as token:
                pickle.dump(credentials, token)
            print(f"New credentials obtained and saved to {token_file}")

    # Final check before building the client
    if not credentials or not credentials.valid:
         # This should ideally not be reached if the logic above is correct, but as a safeguard
         print("Error: Could not obtain valid credentials after authentication attempts.")
         # Optionally, try deleting the token file again if it exists and might be corrupt
         if os.path.exists(token_file):
             try:
                 os.remove(token_file)
                 print(f"Removed potentially problematic token file: {token_file}. Please re-run.")
             except OSError as oe:
                 print(f"Error removing token file {token_file}: {oe}")
         raise Exception("Failed to obtain valid YouTube API credentials.")


    # Build the YouTube client
    try:
        return googleapiclient.discovery.build(
            api_service_name, api_version, credentials=credentials
        )
    except Exception as e:
        print(f"Error building YouTube client: {e}")
        # Attempt to delete potentially corrupted token file if build fails
        if os.path.exists(token_file):
             try:
                 os.remove(token_file)
                 print(f"Removed potentially corrupted token file: {token_file}. Please re-run the script.")
             except OSError as oe:
                 print(f"Error removing token file {token_file}: {oe}")
        raise # Re-raise the exception


def get_related_videos_details(query, max_results=10):
    """
    Searches YouTube for videos related to the query and returns details
    in a specific list format.
    """
    youtube = get_youtube_client() # This now uses the corrected auth logic

    try:
        request = youtube.search().list(
            part="snippet", # Snippet contains title, description, thumbnails
            q=query,
            type="video",
            maxResults=max_results
        )
        response = request.execute()
    except googleapiclient.errors.HttpError as e:
        print(f"An API error occurred: {e}")
        # Handle specific errors if needed, e.g., quota exceeded
        try:
            error_details = json.loads(e.content.decode('utf-8'))
            if 'error' in error_details and 'errors' in error_details['error']:
                for err in error_details['error']['errors']:
                    print(f"  Reason: {err.get('reason')}, Message: {err.get('message')}")
        except (json.JSONDecodeError, AttributeError, KeyError):
             print("Could not parse error details from API response.")
        return [] # Return empty list on error
    except AttributeError as e:
         # Can happen if get_youtube_client() failed and returned None or raised before returning
         print(f"Error: Could not get YouTube client. Authentication might have failed. Details: {e}")
         return []
    except Exception as e:
        print(f"An unexpected error occurred during YouTube search: {e}")
        return []

    video_details_list = []
    items = response.get("items", [])

    for i, item in enumerate(items):
        # Ensure the item is a video and has the necessary structure
        if item.get("id", {}).get("kind") == "youtube#video":
            video_id = item["id"]["videoId"]
            snippet = item.get("snippet", {})
            title = snippet.get("title", "N/A")
            description = snippet.get("description", "N/A")

            # Get thumbnail URL (prefer high quality, fallback to default)
            thumbnails = snippet.get("thumbnails", {})
            thumbnail_url = thumbnails.get("high", {}).get("url") or \
                            thumbnails.get("medium", {}).get("url") or \
                            thumbnails.get("default", {}).get("url", None)

            # --- Placeholder values for non-API fields ---
            difficulty_level = "unknown" # Not provided by YouTube API search
            is_free = True              # Assume free to watch (standard YouTube)
            # ---------------------------------------------

            video_data = {
                "id": str(i + 1), # Sequential ID starting from 1
                "title": title,
                "description": description,
                "difficulty_level": difficulty_level,
                "is_free": is_free,
                "video_id": video_id,
                "thumbnail_url": thumbnail_url
            }
            video_details_list.append(video_data)
        else:
             print(f"Skipping item {i} as it doesn't seem to be a video result: {item.get('id')}")


    return video_details_list
def Check(query):
    if query:
        related_videos_list = get_related_videos_details(query, max_results=5) # Limit results for demo

        if related_videos_list:
            # Create the final dictionary structure
            output_json_structure = {
                query: related_videos_list
            }

            print("\nRelated Video Details (JSON format):")
            # Use json.dumps for pretty printing the dictionary
            return json.dumps(output_json_structure, indent=4)
        else:
            print(f"No video details found for query '{query}' or an error occurred.")
    else:
        print("No search query entered.")
# q=input("Enter search query: ")
# print(Check(q))

# ======== Course Generation with LLM ========
@app.route("/get-courses", methods=["POST"])
def get_courses():
    data = request.get_json()
    topic = data.get("topic", "").lower()
    if topic:
        courses= Check(topic)
        for course in courses:
            if not all(key in course for key in ['id', 'title', 'video_id']):
                raise ValueError("Invalid course structure")
        
        return jsonify({
            "success": True,
            "courses": courses
        })
        
    except Exception as e:
        print(f"Error generating courses: {str(e)}")
        # Fallback to hardcoded courses if LLM fails
        hardcoded_courses = {
            "python": [
                {
                    "id": "1",
                    "title": "Python for Beginners - Full Course",
                    "description": "Complete Python programming course for beginners",
                    "difficulty_level": "beginner",
                    "is_free": True,
                    "video_id": "rfscVS0vtbw",
                    "thumbnail_url": "https://i.ytimg.com/vi/rfscVS0vtbw/maxresdefault.jpg"
                }
            ],
            "react": [
                {
                    "id": "2",
                    "title": "React JS Full Course",
                    "description": "Complete React JS course for beginners",
                    "difficulty_level": "beginner",
                    "is_free": True,
                    "video_id": "w7ejDZ8SWv8",
                    "thumbnail_url": "https://i.ytimg.com/vi/w7ejDZ8SWv8/maxresdefault.jpg"
                }
            ]
        }
        
        if topic in hardcoded_courses:
            return jsonify({
                "success": True,
                "courses": hardcoded_courses[topic]
            })
        else:
            return jsonify({
                "success": False,
                "message": f"No courses found for {topic}",
                "courses": []
            })
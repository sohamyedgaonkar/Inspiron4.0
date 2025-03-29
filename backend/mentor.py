import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist

def suggest_mentors(user_number, selected_subjects, user_data, num_suggestions=5, min_diff=0.04, max_diff=0.15):
    
    if user_number < 0 or user_number >= len(user_data):
        raise ValueError("Invalid user number. Please select a valid number.")

    selected_user = user_data.iloc[user_number]
    selected_user_expertise = selected_user[selected_subjects].to_numpy()

    def is_mentor(candidate):
        candidate_expertise = candidate[selected_subjects].to_numpy()
        differences = candidate_expertise - selected_user_expertise
        return np.all((differences >= min_diff) & (differences <= max_diff))

    potential_mentors = user_data[user_data.apply(is_mentor, axis=1)].copy()

    potential_mentors = potential_mentors.drop(user_number, errors='ignore')

    if potential_mentors.empty:
        return pd.DataFrame([], columns=["User Name", "Similarity Score"] + selected_subjects)
    selected_user_vector = selected_user[selected_subjects].to_numpy().reshape(1, -1)
    mentor_vectors = potential_mentors[selected_subjects].to_numpy()
    similarity_scores = 1 - cdist(selected_user_vector, mentor_vectors, metric="cosine")[0]
    potential_mentors["Similarity Score"] = similarity_scores
    potential_mentors = potential_mentors.sort_values(by=selected_subjects, ascending=False)
    return potential_mentors.head(num_suggestions)

file_path = "users_expertise_dataset.csv"  
user_data = pd.read_csv(file_path)

selected_user_number = int(input("Enter User"))  
selected_subjects = ["Data Science","E-commerce"]  
mentors = suggest_mentors(selected_user_number, selected_subjects, user_data)

print(f"Selected User: {user_data.iloc[selected_user_number]['User Name']}")
print("\nSuggested Mentors:")
print(mentors)

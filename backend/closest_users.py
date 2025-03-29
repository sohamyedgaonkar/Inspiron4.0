import pandas as pd
import numpy as np
from scipy.spatial.distance import cdist

def find_closest_users(user_number, user_data, num_closest=4):
    expertise_matrix = user_data.iloc[:, 1:].to_numpy()
    if user_number < 0 or user_number >= len(expertise_matrix):
        raise ValueError("Invalid user number. Please select a valid number.")

    selected_user_vector = expertise_matrix[user_number].reshape(1, -1)

    distances = cdist(selected_user_vector, expertise_matrix, metric="euclidean")[0]

    closest_indices = np.argsort(distances)[1:num_closest + 1]

    max_distance = distances[closest_indices].max()
    confidence_scores = 1 - (distances[closest_indices] / max_distance)

    
    closest_users = user_data.iloc[closest_indices].copy()
    closest_users["Confidence Score"] = confidence_scores

    return closest_users


file_path = "users_expertise_dataset.csv" 
user_data = pd.read_csv(file_path)


selected_user_number = int(input("Enter User"))  
closest_users = find_closest_users(selected_user_number, user_data)

print(f"Selected User: {user_data.iloc[selected_user_number]['User Name']}")
print("\nClosest Users:")
print(closest_users)
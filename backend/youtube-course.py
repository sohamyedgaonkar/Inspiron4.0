import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import numpy as np

# Load pre-trained sentence transformer model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Define reference sentences for difficulty estimation
basic_ref = "Basic introduction tutorial fundamentals beginner"
advanced_ref = "Advanced expert master deep dive complex"

# Generate reference embeddings
basic_embedding = model.encode([basic_ref])[0]
advanced_embedding = model.encode([advanced_ref])[0]

def calculate_difficulty(text):
    """Calculate difficulty score using semantic similarity"""
    embedding = model.encode([text])[0]
    basic_score = cosine_similarity([embedding], [basic_embedding])[0][0]
    advanced_score = cosine_similarity([embedding], [advanced_embedding])[0][0]
    return advanced_score - basic_score

def generate_learning_path(dataset_path, num_videos=10):
    # Load dataset (assuming CSV format with title and description)
    df = pd.read_csv(dataset_path)
    
    # Preprocess text
    df['text'] = df['title'] + ' ' + df['description']
    
    # Calculate difficulty scores
    df['difficulty'] = df['text'].apply(calculate_difficulty)
    
    # Sort by difficulty
    sorted_df = df.sort_values('difficulty').reset_index(drop=True)
    
    # Select evenly spaced videos for gradual progression
    selected_indices = np.linspace(0, len(sorted_df)-1, num=num_videos, dtype=int)
    learning_path = sorted_df.iloc[selected_indices]
    
    return learning_path[['title', 'description', 'difficulty']]
def generate_subject_specific_path(dataset_path, target_subject, num_videos=10):
    # Load dataset and filter by subject
    df = pd.read_csv(dataset_path)
    subject_df = df[df['topic'] == target_subject].copy()
    
    # Generate subject-specific reference embeddings
    subject_basic_ref = f"{target_subject} basic introduction fundamentals primer"
    subject_advanced_ref = f"{target_subject} advanced expert master research"
    
    basic_embedding = model.encode([subject_basic_ref])[0]
    advanced_embedding = model.encode([subject_advanced_ref])[0]

    # Recalculate difficulty with subject-specific references
    def subject_difficulty(text):
        embedding = model.encode([text])[0]
        basic_score = cosine_similarity([embedding], [basic_embedding])[0][0]
        advanced_score = cosine_similarity([embedding], [advanced_embedding])[0][0]
        return advanced_score - basic_score
    
    subject_df['difficulty'] = subject_df['text'].apply(subject_difficulty)
    
    # Rest remains similar but within subject
    sorted_df = subject_df.sort_values('difficulty').reset_index(drop=True)
    selected_indices = np.linspace(0, len(sorted_df)-1, num=num_videos, dtype=int)
    return sorted_df.iloc[selected_indices]
# Example usage
if __name__ == "__main__":
    dataset_path = "youtube_videos.csv"  # Replace with your dataset path
    learning_path = generate_learning_path(dataset_path)
    
    print("Recommended Learning Path:")
    for i, row in learning_path.iterrows():
        print(f"\nVideo {i+1} (Difficulty: {row['difficulty']:.2f}):")
        print(f"Title: {row['title']}")
        print(f"Description: {row['description'][:100]}...")
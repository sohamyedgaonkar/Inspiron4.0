import pandas as pd
import numpy as np
from openai import OpenAI
from sentence_transformers import SentenceTransformer
from sklearn.cluster import KMeans

class CurriculumSequencer:
    def __init__(self, api_key):
        # Initialize NVIDIA API client
        self.client = OpenAI(
            base_url="https://integrate.api.nvidia.com/v1",
            api_key=api_key
        )
        
        # Sentence transformer for semantic embeddings
        self.embedder = SentenceTransformer('all-mpnet-base-v2')
        
        # Curriculum complexity levels
        self.levels = [
            "basic introduction", 
            "fundamental concepts",
            "essential techniques",
            "practical applications",
            "advanced theories",
            "expert-level content",
            "research-oriented material",
            "cutting-edge developments",
            "specialized mastery"
        ]

    def estimate_complexity(self, text):
        # Use Llama-3 via NVIDIA API for complexity estimation
        prompt = f"""
        Analyze this educational content and classify its complexity level (1-9):
        {text}
        
        Complexity Scale:
        1. Basic introduction
        2. Fundamental concepts
        3. Essential techniques
        4. Practical applications
        5. Advanced theories
        6. Expert-level content
        7. Research-oriented material
        8. Cutting-edge developments
        9. Specialized mastery
        
        Return ONLY the number corresponding to the complexity level.
        """
        
        try:
            completion = self.client.chat.completions.create(
                model="meta/llama3-70b-instruct",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                top_p=0.9,
                max_tokens=10
            )
            response = completion.choices[0].message.content
            return int(response.strip())
        except Exception as e:
            print(f"Error estimating complexity: {str(e)}")
            return 1  # Fallback to basic level

    def create_curriculum(self, df, subject):
        # Filter by subject
        subject_df = df[df['Subject'].str.lower() == subject.lower()]
        
        # Combine relevant text features
        text_data = subject_df['Name'] + " " + subject_df['Description']
        
        # Create semantic embeddings
        embeddings = self.embedder.encode(text_data.tolist(), show_progress_bar=True)
        
        # Cluster videos into 9 groups
        kmeans = KMeans(n_clusters=9, random_state=42)
        clusters = kmeans.fit_predict(embeddings)
        
        # Estimate complexity for each cluster
        cluster_complexities = []
        for i in range(9):
            cluster_samples = text_data[clusters == i].sample(min(3, sum(clusters == i)))
            avg_complexity = np.mean([self.estimate_complexity(t) for t in cluster_samples])
            cluster_complexities.append(avg_complexity)
        
        # Sort clusters by complexity
        cluster_order = np.argsort(cluster_complexities)
        
        # Generate final sequence
        sequence = []
        for cluster in cluster_order:
            cluster_videos = subject_df.iloc[np.where(clusters == cluster)[0]]
            sequence.append(cluster_videos.sample(1).iloc[0])
        
        return pd.DataFrame(sequence)

def main():
    # Get API key securely
    api_key = "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"
    sequencer = CurriculumSequencer(api_key)
    
    # Load data
    csv_path = r"""C:\Users\DELL\Desktop\amdocs\YouTube_Video_Dataset.csv"""
    df = pd.read_csv(csv_path)
    
    # Get subject
    #subject = input("Enter target subject: ")
    
    # Generate curriculum
    curriculum = sequencer.create_curriculum(df, "AIML")
    
    print("\nRecommended Learning Path:")
    print(curriculum)

if __name__ == "__main__":
    main()
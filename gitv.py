import subprocess

def git_commit_push(commit_message):
    try:
        # Add all changes
        subprocess.run(["git", "add", "."], check=True)
        
        # Commit with the provided message
        subprocess.run(["git", "commit", "-m", commit_message], check=True)
        
        # Push changes to the specified branch
        subprocess.run(["git", "push", "origin", "main"], check=True)
        
        print("Changes have been successfully pushed to 'main'.")
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")
        print("Make sure you have initialized a Git repository and you are in the correct directory.")

# Example usage
commit_message = input("Enter your commit message: ")
git_commit_push(commit_message)

# ThinkTrails
Learn Through Adventure!

## Setup Instructions
1. Install pip packages by using `pip install -r requirements.txt`
2. Get an OpenAI Key and save it to your environment under the name OPENAI_API_KEY
- To save an environment variable in bash, open the profile by running this command in the terminal: `sudo nano ~/.bash_profile`
- Then, at the end of this document, you can then enter `export OPENAI_API_KEY=YOUR KEY` to save the key
3. Now you can finally run the program by using `uvicorn main:app --reload`!

## Code Explanation
This project uses FastAPI for the backend and basic HTML/CSS/JS in the frontend. In short, the project communicates data from the frontend using the `fetch` function in Javascript. The FastAPI backend, which is rate limitted to 1req/20s to prevent API misuse, then sends this data from the frontend to ChatGPT via the OpenAI API. The OpenAI API then sends the JSON data back to the FastAPI instance, which then returns it to the frontend in Javascript where it is utilized in the project.

![Flow Chart](https://github.com/user-attachments/assets/5ccd17a9-284d-4b83-989d-1f73b14a8a25)

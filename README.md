# ThinkTales
[![Watch the video](https://github.com/user-attachments/assets/804ecf30-2890-4344-893e-5b28be7812a4)](https://youtu.be/FA9hQ6gMCP0)
*Click the above image to watch the demo video!*

## Setup Instructions
1. Install pip packages by using `pip install -r requirements.txt`
2. Get an OpenAI Key and save it to your environment under the name OPENAI_API_KEY
- To save an environment variable in bash, open the profile by running this command in the terminal: `sudo nano ~/.bash_profile`
- Then, at the end of this document, you can then enter `export OPENAI_API_KEY=YOUR KEY` to save the key
3. Now you can finally run the program by using `uvicorn main:app --reload`!

## Code Explanation
This project uses FastAPI for the backend and basic HTML/CSS/JS in the frontend. In short, the project communicates data from the frontend using the `fetch` function in Javascript. The FastAPI backend, which is rate limitted to 1req/20s to prevent API misuse, then sends this data from the frontend to ChatGPT via the OpenAI API. The OpenAI API then sends the JSON data back to the FastAPI instance, which then returns it to the frontend in Javascript where it is utilized in the project.

![Flow Chart](https://github.com/user-attachments/assets/5ccd17a9-284d-4b83-989d-1f73b14a8a25)

## Inspiration
As a public school student for the last eleven years of my life, I personally know the feeling of sitting in a classroom with thirty other students and completely zoning out from the lesson. Within our public education system, it is far too easy for students to fall through the cracks despite technological advances. Large class sizes, a dull learning environment, rote memorization, and more contribute to students disengaging from school lessons. To solve this issue, especially for disengaged younger children who need this crucial, base knowledge, I created this app.

## What it does
ThinkTales allows children to insert themselves into their own personalized educational adventure. To start, the child inputs their name, age, story idea, and the subject they want to learn. This data is then used by the AI to create the beginning of a captivating story that is presented to the child. After this short story, the child then answers a question pertaining to the subject they want to learn and that connects to the story. They then see the correct answer with a full explanation and can choose between two paths to continue the story based on their multiple-choice response. The story then continues and this process repeats until the child has fully mastered that subject!

## Challenges I ran into
I ran into the challenge of having to dynamically create the buttons and new story elements using JavaScript. This was a challenging problem because I had to find a way to create a function that could be reused (following DRY principles) to dynamically create buttons, a simulated typed story, and more. I also ran into the challenge of the ChatGPT prompt giving me incorrect JSON or a bad story. I attempted to fix this issue (to the best of my ability, since AI is not perfect) by re-engineering the prompt continuously based on testing.

## What's next for ThinkTales
I hope to spread the project through Social Media and with my local school district. I hope to add an algorithm in the future that makes the education process more impactful and personal by dynamically changing question difficulty based on their answers. I also hope to integrate more gamified and fun features that make learning more attractive, like a ranking system, achievements, story collectibles, avatars, etc. This is only the start for ThinkTales!

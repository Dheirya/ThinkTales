from starlette.responses import FileResponse, JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from fastapi.templating import Jinja2Templates
from slowapi.errors import RateLimitExceeded
from fastapi.staticfiles import StaticFiles
from slowapi.util import get_remote_address
from fastapi import FastAPI, Request
from openai import OpenAI
import json
import os


limiter = Limiter(key_func=get_remote_address)
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
templates = Jinja2Templates(directory="web")
app.mount("/static", StaticFiles(directory="static"), name="static")
client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])
prompt_instructions = """You are a creative interactive AI storyteller-educator for gifted students aged AGE. Your task is to generate a captivating and unique story based on the provided PROMPT, seamlessly integrating concepts/topics from their provided FOCUS SUBJECT. The story should be engaging, educational, and suitable for that specified AGE.

Process:
Write multiple paragraphs (200+ words in total) that are broken with linebreaks (use <br><br>) for the readability of a vivid story based on the PROMPT starring NAME. Do not finish the entire story at once—instead, keep it detailed with dialogue (seperated by linebreaks using <br><br>) and try to keep it going by adding new elements/issues/challenges! Make sure to have an issue/central plot device. Use emojis, good dialogue, and frequent linebreaks (use <br><br>).
Then develop a hard, unique question (so it won't be repeated) focusing on the FOCUS SUBJECT appropriate for the AGE group. The question does not have to fully relate to the story and should be relevant to the FOCUS SUBJECT. Note that the question should not be asked in the story but provided in the JSON!
Pose 4 multiple-choice answers (A-D): 1 correct (please verify your correctness carefully, especially for Math or Science questions, and make sure you chose the right option; triple check your answer!), 3 plausible distractors. Randomize where the correct answer is placed (A-D).
1 detailed and thorough paragraph explanation of the correct answer and why the others are wrong. Do not refer to the options by the letters. Remember, the goal is to TEACH the student!
Two GOOD/BAD story paths that are creative and fun. The paths should not end the story, but rather should let in branch in ways that make it exciting, funny, crazy, or suspenseful.

Return super-minified JSON in CORRECT JSON FORMAT (one line ONLY AND PLEASE MAKE SURE YOUR JSON IS FORMATTED CORRECTLY AND IS CORRECT) with these EXACT fields: Story, Question, OptionA, OptionB, OptionC, OptionD, Right_Answer_Letter, Right_Answer_Explanation, Good_Story_Option1, Good_Story_Option2, Bad_Story_Option1, Bad_Story_Option2.

For linebreaks, use <br><br> in the JSON response. Do not use any other linebreaks or formatting in the JSON response.

After the first prompt, I will keep telling you the story/next question topic and repeat the process. Try to keep the story flowing. Please make different questions each time, and make sure they are unique! REMEMBER TO ONLY RESPOND WITH THE MINIFIED JSON IN THE CORRECT FORMAT WITH ESCAPED CHARACTERS! THERE SHOULD BE NO ERRORS IN PROCESSING YOUR JSON RESPONSE; PLEASE MAKE SURE IT IS CORRECT!

FINAL WARNING: WHEN YOU USE SPECIAL CHARACTERS LIKE QUOTATION MARKS, PLEASE MAKE SURE THEY ARE ESCAPED BY USING BACKSLASHES!"""


@app.get("/")
async def index():
    return FileResponse("web/index.html")


@app.post("/gpt")
@limiter.limit("1/20 seconds")
async def gpt(request: Request):
    data = await request.json()
    text = data["text"]
    print(text)
    response = client.responses.create(model="gpt-4.1-nano", instructions=prompt_instructions, input=text)
    print(response.output_text)
    json_data = json.loads(response.output_text)
    return JSONResponse(content=json_data)

#!/usr/bin/env python
import typer
import click
import subprocess
import json
import sys
import os
import re
import logging
import subprocess
from linkup import LinkupClient
from dotenv import load_dotenv
from personalization_client import PersonalizationClient

load_dotenv()

linkup_client = LinkupClient(api_key=os.getenv("LINKUP_API_KEY"))
fastino = PersonalizationClient(api_key=os.getenv("PIONEER_API_KEY"))

app = typer.Typer()

def run(command):
  try:
    return subprocess.check_output(command, shell=True, text=True, stderr=subprocess.STDOUT).strip()
  except subprocess.CalledProcessError as e:
    return str(e)

logging.basicConfig(level=os.getenv('LOGLEVEL') or logging.DEBUG)

user_dict = {}
def get_users():
    me= run('git config get user.email')
    user_dict[me] = {'name': run('git config get user.name'), 'type': 'me'}

    def git_users(user_dict):
        users = run('git log --pretty="%an:%ae"').split('\n')
        users = filter(lambda x: 'noreply' not in x, users)
        for x in users:
            name, email = x.split(':')
            if email not in user_dict:
                user_dict[email] = {'name':name}

    if os.path.isdir('.git'):
        git_users(user_dict)

def register_users():
    for email in user_dict.keys():
        res = fastino.register_user(
            email=email,
            traits={"name": user_dict[email].get('name')}
        ).user_id
        logging.info(f'Registing {email}')

get_users()
register_users()
sys.exit()

# Register a user
user_id = response.user_id

# Ingest conversation data
fastino.ingest_data(
    user_id=user_id,
    source="slack",
    message_history=[
        {"role": "user", "content": "I love hiking", "timestamp": "2025-01-01T10:00:00Z"}
    ]
)

# Fetch the user's profile summary
summary = fastino.get_summary(user_id=user_id)
print(summary.summary)
sys.exit()


@app.command()
def main(query: str = typer.Option(..., help="The user's query about what libraries they need"), 
         type: str = typer.Option("all", help="Type of search to perform (basic, system, personal, all)")):
    """
    Suggests libraries based on a user query.
    --type (basic) means we simply go to linkup and do a simple search
    --type (system) means we use our mcp server to add our system information into the context
    --type (personal) means we use fastino to add how we are to the search
    --type (all) means we do everything.
    """

    caching_solutions = []
    if type == "system" or type == "all":
        codebase_info = get_codebase_info()
        query = f"With this codebase info {codebase_info}, {query}"

    if type == "personal" or type == "all":
        fastino_info = get_fastino_info()
        query = f"With this user info {fastino_info}, {query}"

    result = web_query(query)


def get_fastino_info():
    """
    Uses Fastino AI to identify the user.
    """
    # Simulate Fastino AI integration
    return "Fastino AI: User is interested in caching solutions."

def get_codebase_info():
    """
    Uses the main.ts MCP server to find information about the install and existing codebase.
    """
    try:
        command = "echo '{\"tool_name\": \"getSystemInfo\", \"arguments\": {}}' | ts-node my-app/src/main.ts"
        result = subprocess.run(command, shell=True, capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError as e:
        return json.dumps({"error": f"Error: {e.stderr}"})

def web_query(query: str):
    """
    Uses the Linkup library to do a web search for a query string.
    """
    try:

        client = LinkupClient(api_key=os.getenv("LINKUP_API_KEY"))

        # Perform a search query
        search_response = client.search(
            query=query,
            depth="standard",
            output_type="sourcedAnswer",
        )

        return(search_response.answer)
    except Exception as e:
        return [f"Error: {str(e)}"]

if __name__ == "__main__":
    app()

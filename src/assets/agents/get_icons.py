import requests

all_data = requests.get("https://valorant-api.com/v1/agents").json()

for agent in all_data["data"]:
    if agent["isPlayableCharacter"]:
        icon_url = agent["displayIcon"]
        agent_name = agent["displayName"]
        if agent_name == "KAY/O":
            agent_name = "KAYO"
        icon_data = requests.get(icon_url).content
        with open(f"src/assets/agents/{agent_name}.png", "wb") as icon_file:
            icon_file.write(icon_data)
        print(f"Downloaded icon for {agent['displayName']}")  
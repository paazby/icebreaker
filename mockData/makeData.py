import random
import json


def readNames():
  with open('./first_names.csv') as f:
    content = f.readlines()
    content = content[0].split('\r')

  content = map(lambda name: name.strip(), content)
  return content

def makeUser(name, names):
  
  randomNumberOfMatches = random.randint(10,50);
  user = {}
  user['username'] = name
  user['matches'] = [];
  for i in range(randomNumberOfMatches):
    randomMatch = random.randint(0, len(names))
    user['matches'].append(names[randomMatch])

  return json.dumps(user)

def createData():
  with open("test.txt", "a") as myfile:
    for i in range(1000):
      names = readNames()
      randomIndex = random.randint(0, len(names))
      name = names[randomIndex];    
      newUser = makeUser(name, names)
      myfile.write(newUser + '\n')


createData()
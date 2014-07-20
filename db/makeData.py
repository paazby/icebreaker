import random
import json
import time


## fb_id | access_token | username | description | is_male | age | 

def readFirstNames():
  with open('./first_names.csv') as f:
    content = f.readlines()
    content = content[0].split('\r')

  content = map(lambda name: name.strip(), content)
  return content[1:]


def readLastNames():
  with open('./last_names.csv') as f:
    content = f.readlines()
    content = content[0].split('\r')

  content = map(lambda name: name.strip(), content)
  return content[1:]



def makeUser(name, names):
  
  randomNumberOfMatches = random.randint(10,50);
  user = {}
  user['username'] = name
  user['matches'] = [];
  for i in range(randomNumberOfMatches):
    randomMatch = random.randint(0, len(names)-1)
    user['matches'].append(names[randomMatch])

  return user

def createData():

  count = 1
  first_names = readFirstNames()
  last_names = readLastNames()

  with open("test.txt", "a") as myfile:
    for i in range(1000):
      result = []
      randomIndex0 = random.randint(0, len(first_names))
      randomIndex1 = random.randint(0, len(last_names))
      first_name = first_names[randomIndex0]
      last_name = last_names[randomIndex1]
      display_name = first_name + ' ' + last_name
      result.append(str(count))
      result.append('null_token')
      result.append(display_name)
      result.append('TODO Description')
      result.append(str(random.randint(0,1)))
      result.append(str(random.randint(18,30)))
      result.append(str(int(time.time())))
      result.append(str(int(time.time())))
      myfile.write(','.join(result) + '\n')
      count+=1

createData()

import random
import json
import time
import csv


## fb_id | access_token | username | description | is_male | age | 


def readFirstNames():
  males = []
  females = []
  with open('./yob2013.txt') as csvfile:
    content = csv.reader(csvfile, delimiter=',')
    for row in content:
      if row[1] == 'M':
        males.append(row[0])
      else: 
        females.append(row[0])
  return (males, females)
  

def readLastNames():
  with open('./last_names.csv') as f:
    content = f.readlines()
    content = content[0].split('\r')

  content = map(lambda name: name.strip(), content)
  return content[1:]

  
def createData():

  count = 1
  male_names, female_names = readFirstNames()
  last_names = readLastNames()

  with open("test.txt", "a") as myfile:
    for i in range(1000):
      result = []
      is_male = random.randint(0,1)
      first_name = ''      
      
      if is_male == 1:
        randomIndex0 = random.randint(0, len(male_names))
        first_name = male_names[randomIndex0]
      else:
        randomIndex0 = random.randint(0, len(female_names))
        first_name = female_names[randomIndex0]

      randomIndex1 = random.randint(0, len(female_names))                            
      last_name = last_names[randomIndex1]
      display_name = first_name + ' ' + last_name
      result.append(str(count))
      result.append('null_token')
      result.append(display_name)
      result.append('TODO Description')
      result.append(str(is_male))
      result.append(str(random.randint(18,30)))
      result.append(str(int(time.time())))
      result.append(str(int(time.time())))
      myfile.write(','.join(result) + '\n')
      count+=1

createData()


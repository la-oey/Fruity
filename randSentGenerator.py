#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Oct 16 13:43:00 2018

@author: Lauren_Oey
"""

import csv
import random

sentArr = []

pretext = "I want "
posttext = "."
vowels = ['a','e','i','o','u']

def genSent(noun, adj0, adj1, prosody):
    det = "a"
    if adj0[0] in vowels:
        det = "an"
    if prosody == 0:
        adj0 = adj0.upper()
    else:
        adj1 = adj1.upper()
    txt = pretext + det + " " + adj0 + " " + adj1 + " " + noun + posttext
    return txt

def genSentFiller(noun):
    det = "a"
    if noun[0] in vowels:
        det = "an"
    txt = pretext + det + " " + noun + posttext
    return txt

with open('stim.txt','r',encoding='utf-8',errors='ignore') as csv_file:
    reader = csv.reader(csv_file, delimiter=',')
    for r in reader:
        for p in range(0,2):
            sentArr.append(genSent(r[0],r[1],r[2],p))
            sentArr.append(genSent(r[0],r[2],r[1],p))

with open('stimFiller.txt','r',encoding='utf-8',errors='ignore') as csv_file:
    reader = csv.reader(csv_file, delimiter=',')
    for r in reader:
        sentArr.append(genSentFiller(r[0]))

random.shuffle(sentArr)

file = open('randomizedSents.txt','w')
file.write("0. Which box would you search first to find it?\n")
for s in range(0, len(sentArr)):
    file.write(str(s+1) + ". " + sentArr[s] + "\n")

file.close()
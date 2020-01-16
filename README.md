# Game of Life in JS

Fullstack Academy workshop.

^^^
I took the code from a workshop we did during my time at Fullstack Academy and kinda frankensteined it (for lack of a better term). The goal is to train an ML model to be given two inputs: a board size (e.g 20 x 20) and a "goal". A goal could be anything from fastest growing population to highest sustained population across n generations. When given these inputs it would return a 2d array representing an inital population (respecting certain constraints like population size and area of distribution).The main "rules" were the ones belonging to Conway's Game of Life. You can read more about that here https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life. 

I was able to change the main functional code up a bit to gather a bunch of data across generations per iteration. Basically I set the board size, how many times I want the game to run back to back, a check for stagnate populations(the board would loop indefintely between a couple of states) and a generational limit. Every state, as in every "tick" was considered a generation. Because of the scaffolding I built on, and the time constraint of the project,I wasn't able to collect the data effectively enough to model trained (data was too big :[ ) but I hope to come back to this project soon and maybe build it from scratch.

IF you'd like to see it work its kinda cool just clone this repo and open it up in your browser (dont forget to npm install) 
# Pavel is Learning Serverless
## About
This is my sandbox for learning AWS.  
I am currently following a tutorial on 
[how to build a serverless and imgur clone](https://tutorialedge.net/projects/building-imgur-clone-vuejs-nodejs/part-1-project-setup/). I hope to grow this further once I am done. 


## Running 
To run the the frontend, execute `npm run serve` from the `~/frontend` directory

To run the backend, execute `node index.js` from the `~/backend` directory

### Part 4 Snags

There are no instructions on how to set up terrform. 
Thankfully, it's just an EXE that you need download and drop into a folder that in your PATH. 
Next, I was very suprised that when I ran terraform, it didn't fail. I expected it to compain about credentials. Turns out, I already had mine setup in my `%userprofile%\.aws` from my previous experiments in AWS, and terraform can pick those up. 

S3 bucket names have to be globally unique, so I had to make sure I change the bucket name everywhere. 

During the commit, I didn't have my .gitignore properly set up, so I got to squash my commits before cleanup. 

## Useful Stuff I Found
Snippet Generator - https://snippet-generator.app/
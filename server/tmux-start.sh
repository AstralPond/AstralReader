#!/bin/bash

session="server"

tmux new-session -d -s $session

window=0
tmux rename-window -t $session:$window 'nodemon'
tmux send-keys -t $session:$window 'npm run dev' C-m

window=1
tmux new-window -t $session:$window -n 'code'
tmux send-keys -t $session:$window 'nvim .' C-m

window=2
tmux new-window -t $session:$window -n 'mongodb'
tmux send-keys -t $session:$window 'docker-compose up --build ' C-m

tmux attach-session -t $session

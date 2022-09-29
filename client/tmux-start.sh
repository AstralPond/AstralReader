#!/bin/bash

session="client"

tmux new-session -d -s $session

window=0
tmux rename-window -t $session:$window 'term'
tmux send-keys -t $session:$window 'npm run serve' C-m

window=1
tmux new-window -t $session:$window -n 'code'
tmux send-keys -t $session:$window 'nvim src' C-m

tmux attach-session -t $session

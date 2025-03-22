#!/bin/bash

git pull
pnpm install
pnpm run build
sudo systemctl restart com-server.service
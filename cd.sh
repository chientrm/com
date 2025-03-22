#!/bin/bash

git pull
pnpm install
pnpm run build
pnpm run migrate
sudo systemctl restart com-server.service
FROM mcr.microsoft.com/vscode/devcontainers/base:ubuntu-24.04

RUN set -x \
    && ln -sf /usr/share/zoneinfo/Asia/Tokyo /etc/localtime \
    && echo 'Asia/Tokyo' >/etc/timezone

USER vscode

# install dependencies
RUN sudo apt-get update && sudo apt-get install -y \
    nodejs npm \
 && sudo apt-get clean \
 && sudo rm -rf /var/lib/apt/lists/*

# install npm packages
RUN sudo npm install -g \
    gh-pages

# install bun
RUN sudo curl https://bun.sh/install | bash \
    && bash -c "source /home/vscode/.bashrc"

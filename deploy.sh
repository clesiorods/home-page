#!/bin/bash

echo "⬇️ Atualizando dados do repositório"
git pull

echo "✅ Copiando arquivos para o servidor"
sudo cp -r ./* /var/www/home-page
FROM node:4

RUN apt-get update \
    && apt-get install --install-recommends --no-install-suggests -y \
        ruby-full \
        pdf2htmlex \
        ghostscript \
    && rm -rf /var/lib/apt/lists/*

RUN gem install --no-ri --no-rdoc docsplit

RUN mkdir /opt/uwazi
WORKDIR /opt/uwazi

COPY package.json /opt/uwazi/
RUN npm install
COPY . /opt/uwazi

RUN /opt/uwazi/node_modules/webpack/bin/webpack.js

VOLUME "/opt/uwazi/uploaded_documents"
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["uwazi"]

EXPOSE 3000

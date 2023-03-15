FROM ubuntu:latest
SHELL ["/bin/bash", "-c"]

RUN apt-get update && apt install
RUN apt-get install openssh-server ufw curl nano build-essential -y
RUN curl https://sh.rustup.rs -sSf | sh -s -- -y

RUN cp /root/.cargo/bin/* /bin/
RUN rustup update stable
RUN mv /root/.cargo/bin/* /bin/


RUN ufw allow ssh
RUN ufw allow 50001/tcp
RUN sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN printf 'root\nroot' | passwd

COPY ./src/ /root/bitcoin-wallet/src/
COPY ./Cargo.toml /root/bitcoin-wallet/
COPY ./command/ /bin/

RUN chmod 744 /bin/bdk_*
RUN sed -i -e 's/\r$//' /bin/bdk_*

RUN cd /root/bitcoin-wallet/src/ && cargo build

ENTRYPOINT service ssh restart && source ~/.cargo/env && bash
EXPOSE 22 50001
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive \
    LANG=en_US.UTF-8 \
    TZ=Etc/UTC \
    DISPLAY=:1 \
    CYPRESS_CACHE_FOLDER=/home/appuser/.cache/Cypress \
    npm_config_update_notifier=false

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
  curl wget gnupg2 ca-certificates sudo \
  libgtk-3-0 libnss3 libxss1 libasound2 libxtst6 libx11-xcb1 libgbm1 \
  x11vnc xvfb fluxbox x11-utils \
  net-tools unzip xterm \
  python3 python3-pip \
  x11-apps feh lxde-core \
  fonts-dejavu-core fonts-dejavu-extra imagemagick \
&& rm -rf /var/lib/apt/lists/*

# Install Node.js 22 and Cypress
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    npm install -g cypress@13.7.3

# Install noVNC
RUN mkdir -p /opt/novnc/utils/websockify && \
    curl -L https://github.com/novnc/noVNC/archive/refs/tags/v1.2.0.tar.gz | tar -xz --strip-components=1 -C /opt/novnc && \
    curl -L https://github.com/novnc/websockify/archive/refs/tags/v0.10.0.tar.gz | tar -xz --strip-components=1 -C /opt/novnc/utils/websockify

# Create user
RUN useradd -m appuser && echo "appuser:appuser" | chpasswd && adduser appuser sudo

# Create required directories
RUN mkdir -p /home/appuser/.npm/_logs /home/appuser/.cache/Cypress

# Copy background logo image
COPY logo.png /home/appuser/logo.png

# Fix permissions
RUN chown -R appuser:appuser /home/appuser

# Configure XTerm dark theme
RUN echo '\
XTerm*background: #1e1e1e\n\
XTerm*foreground: #c0c0c0\n\
XTerm*faceName: DejaVu Sans Mono\n\
XTerm*faceSize: 20\n\
XTerm*scrollBar: false\n\
XTerm*allowBoldFonts: true\n\
XTerm*cursorColor: #00ff00\n\
' > /home/appuser/.Xresources

# Switch to appuser
USER appuser
WORKDIR /home/appuser

# Copy your AI Cypress project into container
COPY --chown=appuser:appuser . /home/appuser/ai-cypress

# Ensure output directory exists (important!)
RUN mkdir -p /home/appuser/ai-cypress/output

# Install project dependencies
WORKDIR /home/appuser/ai-cypress
RUN npm install && npx cypress install

# Create a run-all wrapper script
RUN echo '#!/bin/bash\n\
cd /home/appuser/ai-cypress\n\
export DISPLAY=:1\n\
xrdb -merge /home/appuser/.Xresources\n\
xterm -e "node run-all.js; bash" &' > /home/appuser/run-all.sh && chmod +x /home/appuser/run-all.sh

# Safe, verbose GUI startup script
RUN echo '#!/bin/bash\n\
Xvfb :1 -screen 0 1280x720x24 &\n\
sleep 2\n\
export DISPLAY=:1\n\
xrdb -merge /home/appuser/.Xresources\n\
fluxbox &\n\
sleep 2\n\
echo "Checking logo image..."\n\
file /home/appuser/logo.png\n\
identify /home/appuser/logo.png\n\
echo "Resizing logo image..."\n\
convert /home/appuser/logo.png -resize 50% /tmp/logo_resized.png\n\
echo "Setting background..."\n\
feh --bg-max /tmp/logo_resized.png || feh --bg-max /home/appuser/logo.png\n\
xterm &\n\
x11vnc -forever -shared -nopw -display :1 -rfbport 5900 &\n\
/opt/novnc/utils/launch.sh --vnc localhost:5900 --listen 8080' > /home/appuser/startup.sh && chmod +x /home/appuser/startup.sh

# Expose noVNC web port
EXPOSE 8080

# Final CMD to launch GUI environment
CMD ["/bin/bash", "/home/appuser/startup.sh"]

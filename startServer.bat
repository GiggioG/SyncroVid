@echo off
IF [%1]==[] (
    set HOST_VIDEO=no
) ELSE (
    set HOST_VIDEO=yes
    set VIDEO_PATH=%1
)
node server.js
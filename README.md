# Docker Windows Notifier

This program is watching your Windows Docker mounts for changes and notifies containers about that.

Because Docker mounts on Windows are just Samba shares and Samba shares protocol doesn't support notification about
changes you normally would have to restart your container (or app in your container) to ie: rebuild the web app you're
working on.

You can read more about this issue [on Docker forums](https://forums.docker.com/t/file-system-watch-does-not-work-with-mounted-volumes/12038/7).

This fixes this issue when working on Windows.

## Installation

### Quick way
If you have `node` and `npm` installed you can install this program globally:
> npm i -g docker-windows-notifier

Pros:
- easy to set-up
- globally available `docker-windows-notifier` command

Cons:
- slower install
- requires `npm` and `node` to be installed on Windows host
- annoying `Terminate batch job (Y/N)?` on CTRL+C

### Better way
Alternatively just [download pre-build binaries](https://github.com/dzek69/docker-windows-notifier/releases) from GitHub Releases.

You'll need to save this file to some directory that is in PATH environment variable of your system or modify PATH.

Pros:
- faster to update, just save in proper place
- doesn't require `npm` or `node` to be installed
- no `Terminate batch job (Y/N)?` on CTRL+C

Cons:
- requires manual PATH set-up or calling with full path

## Usage

Let me just copy-paste `docker-windows-notifier --help` here:

```
  Usage: docker-windows-notifier [options]


  Options:

    -v, --version                                       output the version number
    -f, --file [path or `*` to use docker-compose.yml]  docker-compose files to be parsed (default: *)
    -s, --service [name,name,...]                       services from each docker-compose file of which volumes should be monitored, comma-separated (default: *)
    --debug                                             debug mode, more logging, more verbose errors
    -h, --help                                          output usage information


  Important:

    - Start your Docker containers before running this program to avoid triggering a lot of notifications that are created during setup phase of your containers. I feel this may even crash your container start-up sometimes. Better safe than sorry
    - Run this when current working directory is the same as docker-compose file location
    - Commands are sent to containers via `container_name` specified in docker-compose service, so make sure to define names before using this program
    - Program is tested with relative to docker-compose paths only
    - If your watch paths are overlapping (ie: ./test and ./test/files) or are duplicated then notifications will be triggered more than once for single change


  Notes:

    - By default this program will get `docker-compose.yml` file and will watch every volume on every service.
    - You can specify multiple docker-compose files.
    - If you want to watch just some of services be sure to pass -s argument for every docker-compose file.
    - You can pass -f * to use `docker-compose.yml` file
    - You can pass -s * to watch every service
    - You can pass just -f or -s argument
    - Selecting volumes to watch is currently not supported


  Examples:

    $ docker-windows-notifier --file * --service * -f docker-compose.dev.yml -s node
    Watch every service of `docker-compose.yml` and `node` service of `docker-compose.dev.yml`

    $ docker-windows-notifier -s node,python
    Watch `node` and `python` services of `docker-compose.yml`
```

## Behind the scenes

The whole idea is taken from [docker-windows-volume-watcher](https://github.com/merofeev/docker-windows-volume-watcher).
When file is changed on host then it is chmodded on container to have save privileges as it already has. This causes
notification on container filesystem, but because Windows doesn't know about privileges at containers and is not
notified back (like it would with `touch` for example) so it doesn't get into infinite loop of detecting changes.

## But why did you rewrite something that already exists?

I found `docker-windows-volume-watcher` to be troublesome. It just throws errors with both Python 2 and Python 3 and it
looks I am not alone with this.

Also the usage is not the same, mine version focuses on docker-compose files.

## Limitations

Same as `docker-windows-volume-watcher`:
- file deletions are not propageted (but this probably could be worked around, we'll see)
- `stat` and `chmod` are required on containers, but I didn't heard about Linux not having those

Plus:
- `cwd` should be the same as location of `docker-compose` file (this may be fixed in the future if needed)

## Some words for people looking for help:

Docker windows doesn't refresh or reload. Windows docker synchronization problem.
Windows docker with webpack. File system watch does not work with mounted volumes.

## License

MIT
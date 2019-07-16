
[//]: # (BEGIN SKIP)

# Contestant Repo
This folder contains a stub project to be given to hackathon contestants, containing:
  - a small amount of source code to get started with
  - documentation and tutorials
  - a Gradle project that contestants can use to build their bot and configure their IDE
  
This folder _shouldn't_ be given to contestants directly because:
 - a small amount of its contents are not for contestants (such as this bit of the README)
 - its build depends on other subprojects, so will fail in isolation
 
Instead, run `./gradlew contestant:build` to assemble it into a form suitable for consumption by contestants.
See below for details.
 
## Building & Testing

The normal Gradle lifecycle tasks will turn this subproject into a standalone project that can be given to contestants:
  - The `assemble` lifecycle task depends on `gitRepo`, `zipWin`, and `tarUnix`
  - The `check` lifecycle task depends on `checkContestantRepo`
  
### `gitRepo`

This task creates a standalone version of this subproject.
It copies the entire subproject into folder in the `build` directory, with the following modifications:
  - Files matching `.gitignore` patterns are not copied
  - In any file, any lines between (and including) <code>BEGIN&nbsp;SKIP</code> and <code>END&nbsp;SKIP</code>
    are stripped out (that is how this portion of the README is excluded)
  - Inter-project and Maven dependencies are replaced with file dependencies in a `libs` subdirectory
  
A Gradle wrapper script is installed in the root of this new subproject, and a new Git repository is initialised.

The generated repository can be uploaded to a Git server for access by contestants.

### `zipWin` and `tarUnix`

These tasks both clone the Git repository created by `gitRepo`, each using appropriate [line ending checkout
configuration](https://git-scm.com/docs/git-config#git-config-coreeol) for their respective platforms.
They then bundle the checked out working directory in an archive file, _without_ the `.git` repository folder.

The outputs of these tasks are suitable for distributing to contestants.
  
### `checkContestantRepo`

This task depends on `gitRepo` and runs a separate `gradlew check` process on it.
If the child process fails, so does this task.

If this task is run alongside other verification tasks (e.g. by running `gradlew check`), then this will be the last to
run. This ensures other checks succeed before the relatively expensive operation of assembling the contestant repo
(along with all its dependencies), and then running a separate build process inside it is attempted.

**The remainder of this README file is what contestants will see.**

[//]: # (END SKIP)

# Scott Logic Coding Challenge

## Setup

### 2 Download this project
You should have access to a zip or tar archive. Download and unzip this in a sensible location.

### 3 Install

There's an installation script in the root folder of this repository. This will download and set up an appropriate
Java Development Kit for your machine.

Optionally, if your Scott Logic host tells you that you need to do this, you can add the `-r` option to configure a
proxy URL for downloading the necessary dependencies.

Open a terminal (command prompt), and run the command below.

Windows command prompt:
```batch
install [-r http://<proxy_host>:8081/repository]
```

Mac or Linux shell:
```sh
./install.sh [-r http://<proxy_host>:8081/repository]
```

In both of the above, `<proxy_host>` is the hostname provided to you by the Scott Logic host at your event,
if necessary. As an example, if the hostname given to you is `WS01161`, then (on Windows):
```batch
install -r http://WS01161:8081/repository
```

If you're told that no proxy needs to be set up, then all you need to type is
```batch
install
```

### 4 (Optional) Install and import into a Java IDE
It will probably be easier to do development in a Java IDE - ideally one that supports importing Gradle projects, like
[Eclipse](https://www.eclipse.org/downloads/) or [IntelliJ IDEA](https://www.jetbrains.com/idea/download/index.html).
Make sure you've set your IDE's JDK to the one downloaded in the above step.
You can find it in the `<project_root_dir>/tools/jdk` folder.

#### Eclipse

Make sure you have the downloaded JDK set as an "installed JRE". Go to **_Window &rarr; Preferences &rarr; Java &rarr;
Installed JREs &rarr; Add &rarr; Standard VM &rarr; Next &rarr; Directory..._**, and navigate to the
`<project_root_dir>/tools/jdk/<jdk_name>` folder.

To open the project, go to **_File &rarr; Import... &rarr; Gradle &rarr; Existing Gradle Project_**,
and follow the prompts in the wizard. 

#### IntelliJ IDEA

First, ensure you have the downloaded JDK set as one of your SDKs. Hit `Ctrl+Alt+Shift+S`, then go to
**_Project Settings &rarr; Project &rarr; New... &rarr; JDK_**, and navigate to the
`<project_root_dir>/tools/jdk/<jdk_name>` folder.

Now, if you **_Open..._** this repository's root folder as an existing project,
IntelliJ should detect Gradle and start the import wizard automatically.
**You shouldn't create a "new project" in IntelliJ, as this will fail to put required libraries on your classpath.**

## Building & Running
In the Gradle tasks on the right hand side of your IntelliJ double click `build`. You will need to build your project
whenever you make a change to your bot that you wish to reconnect and test.

To connect your bot so you can test it against the default bots login to your hackathon viewer with the username and
password provided. Go to the `Remote Bot` dashboard, click `Connect` then run the following command and wait until it
has connected.

```
java  -Dorg.slf4j.simpleLogger.showDateTime=true -Dorg.slf4j.simpleLogger.dateTimeFormat="yyyy-MM-dd HH:mm:ss:SSS Z"
-Dorg.slf4j.simpleLogger.defaultLogLevel=all  -jar <path_to_your_repository>/libs/remote-1.0-SNAPSHOT-all.jar
--botclasspath <path_to_your_repository>/build/classes/java/main --bot com.contestantbots.team.ExampleBot
--team <your_team_name> --host <host_name_supplied_to_you> --port 8080
```

Now you can test your bot against the default bot by clicking `Test` and waiting. Change the speed of the game play to
more easily see what is going on, you can also replay the game but sliding the slider on the lower chart back.

## Restrictions
There are only a few
restrictions on the compiled code:
- the com.contestantbots.team package should only contain classes that extend `com.scottlogic.hackathon.game.Bot`
- any helper or utility classes should either be
  - inner classes of your Bot, or
  - not have a public constructor
- your Bot should take no more than half a second to calculate the moves or else it will be disqualified
- your Bot should take no more than 2 seconds for its `initialise(...)` method to run (if implemented) or else it will
  be disqualified

When you're ready to move on this [tutorial](docs/tutorials/1-adding-movement.md) provides a step-by-step guide to adding
some basic intelligence to your bot.

package com.scottlogic.hackathon.client;

import org.apache.commons.cli.*;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

class ArgumentsBuilder {
    private static final String DEFAULT_MAP = "Easy";
    private static final String DEFAULT_BOT = "Milestone1";
    private final List<String> errors;
    private final String[] arguments;
    private final boolean parsed = false;
    private String map;
    private String bot;
    private String className;
    private Options options;

    public ArgumentsBuilder(final String[] args) {
        errors = new ArrayList<String>();
        arguments = args;
        options = new Options();
    }

    public Arguments create() {
        createOptions();

        Arguments arguments = null;
        if (this.arguments.length < 1) {
            printUsage();
        } else {
            parse();
            validate();
            if (this.errors.size() > 0) {
                printErrors();
            } else {
                arguments = new Arguments(
                        map == null ? DEFAULT_MAP : map,
                        bot == null ? DEFAULT_BOT : bot,
                        className);
            }
        }
        return arguments;
    }

    public Options createOptions() {
        options.addOption("m", "map", true, "MapName: a map name (VeryEasy, Easy, Medium, LargeMedium, Hard)\t\t default: Easy");
        options.addOption("b", "bot", true, "Bot: a bot name to play against (Default, Milestone1, Milestone2, Milestone3)\t\tdefault: Milestone1");
        options.addOption("c", "className", true, "ClassName: full class name (include package) of your bot e.g. com.contestantbots.team.ExampleBot");
        return options;
    }


    public void printUsage() {
        HelpFormatter formatter = new HelpFormatter();
        formatter.printHelp(" [-m|map MapName] [-b|bot Bot] [-c|className] ClassName", options);
    }

    private void parse() {
        CommandLineParser parser = new DefaultParser();
        CommandLine cmd = null;

        try {
            cmd = parser.parse(options, arguments);
            if (cmd.hasOption("h") || cmd.hasOption("-?")) {
                printUsage();
            }

            if (cmd.hasOption("m")) {
                map = cmd.getOptionValue("m");
            }

            if (cmd.hasOption("b")) {
                bot = cmd.getOptionValue("b");
            }

            if (cmd.hasOption("c")) {
                className = cmd.getOptionValue("c");
            } else {
                List<String> additionalArgs = cmd.getArgList();
                if(additionalArgs.size() > 0) {
                    className= additionalArgs.get(0);
                }
            }

        } catch(Exception e) {
            printErrors();
        }
    }

    private void validate() {
        if (className == null) {
            errors.add("class name must be provided");
        }
    }

    public void printErrors() {
        errors.forEach(error -> {
            System.err.println(error);
        });
        printUsage();
    }

}
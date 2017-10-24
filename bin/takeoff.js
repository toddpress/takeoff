#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2));
const pkg = require('../package.json');

const takeoff = {
    args: {},
    pkg,
    plugins: {},
    currentGroup: null,
    set group(name) {
        if (!this.plugins[name]) this.plugins[name] = {};
        this.currentGroup = name;
    },
    task: async function (name, fn) {
        if (!this.currentGroup) {
            throw new Error('You need to set a group for your tasks');
        }
        if (this.plugins[this.currentGroup][name]) {
            throw new Error(`Plugin ${name} already registered in group ${this.currentGroup}`);
        }
        this.plugins[this.currentGroup][name] = { name, fn };    
    },
    endGroup: function () {
        this.currentGroup = null;
    },
    run: function (args) {
        this.args = args;
        const [cmd, env, subtask] = args._;

        if (!subtask) {
            const plugin = this.plugins.root[cmd];
            if (!plugin) {
                return console.error(`Command ${plugin} not found`)
            }
            plugin.fn(env);
        }
    }
};

takeoff.group = 'root';
takeoff.task('destroy', async (env) => console.log(`Spoooon! Evil dooers of ${env}, eat my justice!`));

takeoff.run(argv);

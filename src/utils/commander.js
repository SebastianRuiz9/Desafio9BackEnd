import {Command} from 'commander'

const program = new Command()

program.option("--mode <mode>", "Modo de trabajo", "Produccion")
program.parse()

export {program}
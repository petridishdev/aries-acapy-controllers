declare var $ENV: IEnv;

interface IEnv {
  RUNMODE: string;
  ALICE_AGENT_HOST: string;
  ALICE_AGENT_PORT: string | number;
}
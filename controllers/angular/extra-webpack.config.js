const webpack = require('webpack');

module.exports = {
    plugins: [
        new webpack.DefinePlugin({
            $ENV: {
                RUNMODE: JSON.stringify(process.env.RUNMODE),
                ALICE_AGENT_HOST: JSON.stringify(process.env.ALICE_AGENT_HOST)
            }
        })
    ]
};
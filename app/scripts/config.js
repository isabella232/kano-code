import es6Assign from 'es6-object-assign';

es6Assign.polyfill();

let COMMON = {
        "WORKSPACE_FULL_SIZE": {
            "width": 512,
            "height": 384
        },
        "WORKSPACE_LED_BORAD_SIZE": {
            "width": 466,
            "height": 240
        },
        "VOICE_API_URL": "http://api.voicerss.org",
        "VOICE_API_KEY": "65b85d9c94094d62bddfd37acd5786b4",
        "WEATHER_API_KEY": "79f483fba81614f1e7d1fea5a28b9750",
        "HARDWARE_API_URL": "http://localhost:4444"
    },
    ENV = {
        "production": {
            "API_URL": "https://api.kano.me",
            "DATA_API_URL": "https://apps-data.kano.me",
            "WORLD_URL": "https://world.kano.me",
            "PLAY_URL": "https://app.kano.me"
        },
        "staging": {
            "API_URL": "https://api-staging.kano.me",
            "DATA_API_URL": "https://apps-data-staging.kano.me",
            "WORLD_URL": "http://world-staging.kano.me",
            "PLAY_URL": "https://app-staging.kano.me"
        },
        "development": {
            "API_URL": "http://localhost:1234",
            "DATA_API_URL": "http://localhost:2020",
            "WORLD_URL": "http://localhost:5000",
            "PLAY_URL": "http://localhost:4001"
        }
    },
    TARGET = {
        "web": {
        },
        "rpi": {
            "API_URL": "http://localhost:8000"
        },
        "osonline": {
            "TOKEN_ENDPOINT": "http://localhost:8000/gettoken",
            "SHUTDOWN_ENDPOINT": "http://localhost:8000/shutdown"
        }
    },
    config;

function getConfig(env, target) {
    env = env || 'development';
    target = target || 'web';

    return Object.assign(COMMON, TARGET[target],
           ENV[env], {"ENV": env, "TARGET": target});
}

/* These window.* variables are exported in both make and play apps. */
config = getConfig(window.ENV, window.TARGET);
export default config;

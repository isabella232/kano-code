let progressService = (sdk) => {
    localStorage.progress = localStorage.progress || JSON.stringify({});

    let progressService = {

        updateProgress: (group, storyNo) => {
            let lsProgress,
                progress,
                p;

            lsProgress = JSON.parse(localStorage.progress);
            lsProgress[group] = lsProgress[group] || {storyNo: 0};
            progress = lsProgress[group];
            progress.storyNo = storyNo;

            localStorage.progress = JSON.stringify(lsProgress);

            if (sdk.auth.getUser()) {
                p = new Promise((resolve, reject) => {
                    sdk.appStorage.set('make-apps', {progress: lsProgress}, (err, data) => {
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    });
                });
            }

            return p;
        },

        loadProgress: (group) => {
            let progress = JSON.parse(localStorage.progress),
                p, prGroup;
            progress[group] = progress[group] || {storyNo: 0};
            prGroup = progress[group];

            if (sdk.auth.getUser()) {
                p = new Promise((resolve, reject) => {
                    sdk.appStorage.get('make-apps', (err, data) => {

                        if (prGroup.storyNo > data.progress[group].storyNo) {
                            // try to sync to the API if local progress is further than the saved one
                            // this might create problems if we have different users on the same device though
                            progressService.updateProgress(group, prGroup.storyNo);
                        } else {
                            prGroup = data.progress[group];
                            //update the localstorage
                            localStorage.progress = JSON.stringify(progress);
                        }
                        resolve(prGroup);
                    });
                });
                return p;
            } else {
                //still return a promise (for consistency), but with data from the localStorage
                return Promise.resolve(progress[group]);
            }
        }
    };

    return progressService;
};

export default progressService;

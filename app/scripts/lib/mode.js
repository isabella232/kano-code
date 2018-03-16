
const Mode = {
    load(modeDefinition) {
        if (!modeDefinition.bundle) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'import';
            link.onload = () => resolve();
            link.onerror = reject;
            link.href = modeDefinition.bundle;
            document.head.appendChild(link);
        });
    },
};

export default Mode;

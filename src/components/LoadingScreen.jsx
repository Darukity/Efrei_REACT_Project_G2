function LoadingScreen() {
    return (
        <div className="vh-100 d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
            </div>
        </div>
    );
}

export default LoadingScreen;

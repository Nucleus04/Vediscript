import "./styles/style.css";
function LoadingComponent () {
    return (
    <div className="loading-background z-index-2">
        <div className="loader blur-effect">
            <div className="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
      
    </div>
    );
}

export default LoadingComponent;
import React, { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext.jsx';

function ToggleButton() {
    const { toggleTheme, theme } = useContext(ThemeContext);
    const [isToggled, setIsToggled] = useState(theme === 'dark');
    const [hasRendered, setHasRendered] = useState(false);

    useEffect(() => {
        if (!hasRendered) {
            setHasRendered(true); // Marque le premier rendu
            return;
        }

        toggleTheme(isToggled ? 'dark' : 'light');
    }, [isToggled]);

    return (
        <>
            <div className="form-check form-switch">
                <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    id="flexSwitchCheckDefault"
                    onChange={(event) => setIsToggled(!isToggled)}
                    checked={isToggled}
                />
            </div>
        </>
    );
}

export default ToggleButton;

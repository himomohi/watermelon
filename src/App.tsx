import { useEffect } from 'react';
import './App.css';
import startGame from '../src/components/main';

function App() {
    useEffect(() => {
        // Start the game with the base theme by default
        startGame('base');
    }, []);

    const handleThemeChange = (theme) => {
        startGame(theme);
    };

    return (
        <div className="App">
            <div id="theme-switcher" style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 100 }}>
                <button onClick={() => handleThemeChange('base')} style={{ marginRight: '10px' }}>
                    Default Theme
                </button>
                <button onClick={() => handleThemeChange('halloween')}>
                    Halloween Theme
                </button>
            </div>
        </div>
    );
}

export default App;

import { useState } from 'react';

function MultipleFive() {
    const defaultList = Array.from({ length: 100 }, () => null).map((item, index) => index + 1);
    const [displayList, setDisplayList] = useState(defaultList);
    const [filtered, setFiltered] = useState(false);

    const filterList = () => {
        if (!filtered) {
            setDisplayList(displayList.filter((item) => item % 5 === 0));
            setFiltered(true);
        } else {
            setDisplayList(defaultList);
            setFiltered(false);
        }
    };

    return (
        <div className="container-fluid">
            <button onClick={() => filterList()}>Multiple de Five</button>
            <ul>
                {displayList.map((index) => (
                    <li key={index}> {index}</li>
                ))}
            </ul>
        </div>
    );
}

export default MultipleFive;

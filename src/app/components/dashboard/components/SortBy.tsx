import * as React from 'react';

class SortBy extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (                
            <div className="col">
                <div className="dropdown text-right">
                    <input className="btn btn-secondary dropdown-toggle text-left" value="Sort By" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    </input>
                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                        <a className="dropdown-item" href="#">Date</a>
                        <a className="dropdown-item" href="#">Url</a>
                    </div>
                </div>
            </div>
        )
    }
}

export default SortBy;
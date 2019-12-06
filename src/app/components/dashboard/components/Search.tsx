import * as React from 'react';

class Search extends React.Component<{}, {}> {
    constructor(props: any) {
        super(props);
    }

    render() {
        return (                
            <div className="col search">
                <div className="md-form active-purple active-purple-2">
                    <input className="form-control" type="text" placeholder="Search" aria-label="Search"></input>
                </div>
            </div>
        )
    }
}

export default Search;
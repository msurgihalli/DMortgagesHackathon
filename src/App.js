import React, { Component } from 'react';
import { Button, Form} from 'reactstrap';
import Web3 from 'aion-web3';
import './App.css';
import InvestorApp from './investorApp';


class App extends Component {
    componentDidMount = () => {

        setInterval(
            function() {
                if (window.aionweb3 ) {
                    this.setState({
                        aionweb3: window.aionweb3, //detect aiwa
                    });

                }

            }.bind(this),
            1000
        );

    };

    constructor(props) {
        super(props);
        this.state = {
            aionweb3: null,
            aiwa: false,
            account: null, //user account,
            value: " ",
            input: " ",
            propertyOwner : '',
            propertyValue : '',
            propertyLocation : '',
            propertyBuyerKyc : '',
            propertyBuyerCreditScore : '',
            propertyBuyerIncome : '',
            propertyLoanRequested : '',
            mortgageMonthlyPayment : '',
            submitted: false,
            result: "",
            // ctAddress: "0xa084b42efa079ad85b2c5b6c3d8a3fc6165cb13d06553ca566c29d89e94b80d2", //contract address,
            // httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=ec13c1ff5f65488fa6432f5f79e595f6"
            ctAddress: "0xa06c074f364a71809795992734e734d233c2bae3cc4c6cf0fc921071c42a3182", //contract address,
            httpProvider: "https://aion.api.nodesmith.io/v1/avmtestnet/jsonrpc?apiKey=3e88992ccd3741109cd484b57cf293aa"
        };
        var array = new Uint32Array(10);
        window.crypto.getRandomValues(array);
        console.log(array[0]);
        this.handleChange = this.handleChange.bind(this);

    }


    //send transaction to the smart contract
    sendTransactionFunction = async (mystring) => {

        //set web3
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        // alert('A name was submitted: ' + mystring);
        //the contract method you want to call
        let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();
        // let data = web3.avm.contract.method('setString').inputs(['string', 'string'],[mystring, tostring]).encode();
        //let strData =  'propertyOwner'+'-'+'propertyValue'+'-'+'propertyLocation'+'-'+'propertyBuyerKyc'+'-'+'propertyBuyerCreditScore'+'-'+'propertyBuyerIncome'+'-'+'propertyLoanRequested'+'-'+'mortgageMonthlyPayment'
        // let data = web3.avm.contract.method('setString').inputs(['string'],[mystring]).encode();

        const txObject = {
            from: this.state.account,
            to: this.state.ctAddress,
            data: data,
            gas: 2000000,
            type: "0x1"  //for any transaction except for java contract deployment
        };

        try {
             await window.aionweb3.sendTransaction(txObject);

            setInterval(
                this.getFunction,
                1000
            );

        } catch (err) {
            console.log("**ERROR "+err);
        }

    };


    //call smart contract method
    getFunction = async () => {
        let web3 = new Web3(
            new Web3.providers.HttpProvider(this.state.httpProvider)
        );

        //set aiwa accouunt
        try {
            this.setState({
                account:  window.aionweb3.account[0]
            })
        } catch(e) {
            console.error("no account for sending", e.message);
        }

        let data = web3.avm.contract.method('getString').encode();

        let txObject = {
            from:this.account,
            to: this.state.ctAddress,
            gas: 100000,
            gasPrice: 1,
            data: data
        };

        try {
            let res = await web3.eth.call(txObject); //call a method
            let returnValue = await web3.avm.contract.decode('string', res);
            this.setState({
                result: returnValue
            });

        } catch (err) {
            console.log("fail calling");
        }
    };

    //get user input
    // handleChange = event => {
    //     this.setState({ value: event.target.value });
    // };
    handleChange = (propName, event) => {
        console.log(propName+' - '+event.target.value);
        this.setState({ [propName]: event.target.value });
        //     this.setState({ propName : event.target.value });
        //     this.setState({ value: event.target.value });
    };

    handleSubmit = event => {
        let input = {
            propertyOwner : this.state.propertyOwner,
            propertyValue : this.state.propertyValue,
            propertyLocation : this.state.propertyLocation,
            propertyBuyerKyc : this.state.propertyBuyerKyc,
            propertyBuyerCreditScore : this.state.propertyBuyerCreditScore,
            propertyBuyerIncome : this.state.propertyBuyerIncome,
            propertyLoanRequested : this.state.propertyLoanRequested,
            mortgageMonthlyPayment : this.state.mortgageMonthlyPayment,
        };
        console.log(this.state.propertyOwner)
        // alert('A name was submitted: ' + JSON.stringify(input));

        this.sendTransactionFunction(JSON.stringify(input));
        // this.sendTransactionFunction(this.state.propertyOwner);
        // this.getInvestorComponent();
        event.preventDefault();
    };



    getInvestorComponent() {
        this.setState({ submitted: true });
    }


    render() {

        if (this.state.submitted) {
            return <InvestorApp  {...this.state}/>;
        }
        else {
            return (
                <div>
                    <div>
                        {/*<Form onSubmit={this.handleSubmit}>*/}
                        {/*    <label>*/}
                        {/*        Set String:*/}
                        {/*        <input*/}
                        {/*            type="text"*/}
                        {/*            value={this.state.value}*/}
                        {/*            onChange={this.handleChange}*/}
                        {/*        />*/}
                        {/*    </label>*/}
                        {/*    <Button type="submit" value="Submit">*/}
                        {/*        Submit*/}
                        {/*    </Button>*/}
                        {/*</Form>*/}


                        <header className="masthead">
                            <div className="container">
                                <div className="intro-text">
                                    <div className="intro-lead-in"></div>
                                    <div className="intro-heading text-uppercase">Blockchain Mortgages!</div>
                                    <a className="btn btn-primary btn-xl text-uppercase js-scroll-trigger"
                                       href="#contact">Apply
                                        Now</a>
                                </div>
                            </div>
                        </header>

                        <section id="contact">
                            <div className="container">
                                <div className="row">
                                    <div className="col-lg-12 text-center">
                                        <h2 className="section-heading text-uppercase">Application</h2>
                                    </div>
                                </div>
                                <div id="mainNav"></div>

                                {/*<form onSubmit ={this.onSubmit.bind(this)} >*/}
                                {/*    {*/}
                                {/*        Object.entries({*/}
                                {/*            "Company Name": "companyName",*/}
                                {/*            "Account Name": "AccountName",*/}
                                {/*            "Bank Name": "bankName",*/}
                                {/*            "Branch": "branch",*/}
                                {/*            "Account Number": "accountNo"*/}
                                {/*        }).map(([field, name]) =>*/}
                                {/*            <FormGroup bssize="sm" key={name}>*/}
                                {/*                <input onChange={this.handleChange(name)} className="form-control" type="text" placeholder={field} name={name} ref={name}  />*/}
                                {/*            </FormGroup>)*/}
                                {/*    }*/}
                                {/*    </form>*/}
                                <Form onSubmit={this.handleSubmit}>

                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="row">
                                                <h3 className="section-subheading text-muted col-md-6">Property
                                                    Information</h3>
                                                <h3 className="section-subheading text-muted col-md-6">Buyer Info
                                                    Number</h3>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" id="propertyOwner" type="text"
                                                               placeholder="Currenty Property Owner *"
                                                               required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyOwner')}
                                                               name={this.state.propertyOwner}
                                                            // data-validation-required-message="Please enter your name."
                                                        />
                                                        {/*<input onChange={this.handleChange} className="form-control"  name={this.state.propertyOwner} ref={this.state.propertyOwner}  />*/}

                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                    <div className="form-group">
                                                        <input className="form-control" id="propertyValue" type="text"
                                                               placeholder="Location *" required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyLocation')}
                                                               name={this.state.propertyLocation}
                                                            // data-validation-required-message="Please enter address"
                                                        />
                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                    <div className="form-group">
                                                        <input className="form-control" id="location" type="number"
                                                               placeholder="Property Value *" required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyValue')}
                                                               name={this.state.propertyValue}
                                                            // data-validation-required-message="Please enter property value."
                                                        />
                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <input className="form-control" id="buyerKYC" type="text"
                                                               placeholder="Buyer KYC - hash of the KYC info (name, address, etc.) *"
                                                               required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyBuyerKyc')}
                                                               name={this.state.propertyBuyerKyc}

                                                            // data-validation-required-message="Please enter your name."
                                                        />
                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                    <div className="form-group">
                                                        <input className="form-control" id="buyerCreditScore"
                                                               type="number"
                                                               placeholder="Buyer Credit Score *" required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyBuyerCreditScore')}
                                                               name={this.state.propertyBuyerCreditScore}
                                                            // data-validation-required-message="Please enter your email address."
                                                        />
                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                    <div className="form-group">
                                                        <input className="form-control" id="buyerIncome" type="number"
                                                               placeholder="Buyer Income *" required="required"
                                                               onChange={this.handleChange.bind(this, 'propertyBuyerIncome')}
                                                               name={this.state.propertyBuyerIncome}
                                                            // data-validation-required-message="Please enter your phone number."
                                                        />
                                                        <p className="help-block text-danger"></p>
                                                    </div>
                                                </div>
                                                <div className="clearfix"></div>
                                                <div className="col-sm-6 text-center">
                                                    <div id="success"></div>


                                                    <Button id="sendMessageButton"
                                                            className="btn btn-secondary btn-xl text-uppercase"
                                                            type="submit" value="Submit">
                                                        Apply
                                                    </Button>

                                                </div>
                                                <div className="col-sm-6 text-center">
                                                    <div id="success"></div>

                                                    <Button id="sendMessageButton"
                                                            className="btn btn-secondary btn-xl text-uppercase"
                                                            onClick={() => this.getInvestorComponent()} >
                                                        Go To Investor page
                                                    </Button>

                                                </div>
                                            </div>
                                            {/*</Form>*/}
                                        </div>
                                    </div>
                                </Form>
                            </div>

                        </section>


                        <div id="output">  {this.state.result}</div>

                    </div>
                </div>
            );
        }
    }
}

export default App;

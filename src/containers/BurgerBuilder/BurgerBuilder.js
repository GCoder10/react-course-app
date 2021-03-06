import React, { Component } from 'react';
import Aux from '../../hoc/AuxFolder/Auxx';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

export class BurgerBuilder extends Component {
    state = {
        purchasing: false
    }

    componentDidMount() {
        this.props.onInitIngredients();
    }

/*
    W ramach cwiczenia pobierania danych z backendu, skladniki
    na starcie beda pobierane z backendu ale trzeba dostosowac
    pare rzeczy:
    Wyswietlenie burgera i skladnikow tylko wtedy, gdy zostana
    otrzymane dane na starcie:


        let burger = <Spinner />
        if (this.state.ingredients) {
            burger = (
                <Aux>
                    <Burger ingredients = { this.state.ingredients } />
                    <BuildControls ingredientAdded = { this.addIngredientHandler } 
                                   ingredientRemoved = { this.removeIngredientHandler } 
                                   disabled = { disabledInfo }
                                   purchasable = { this.state.purchasable } 
                                   price = { this.state.totalPrice } 
                                   ordered = { this.purchaseHandler } />
                </Aux>
            );            
        }


*/


updatePurchaseState(ingredients) {
    // Sprawdzenie czy mozna juz zamowic burger
    // 1. Korzystanie z najnowszej tablicy ingredients zamiast
    // kopiowanie state (...this.state.ingredients)
    // 2. sum jest stala, bedaca liczba wszystkich skladnikow
    // bedzie mozna zamowic burgera jezeli wystepuje choc jeden
    // skladnik
    const sum = Object.keys(ingredients).map(igKey => {
        return ingredients[igKey];
    })
    .reduce((sum, el) => {
        return sum + el;
    }, 0);
    // 3. Zaktualizowanie oryginalnego state aplikacji
    // na sam koniec
    // purchasable: true, jezeli sum > 0
    return sum > 0;
    // Info idzie do BuildControls
    // Button bedzie dostepny, jezeli bedzie wartosc true 
    // przekazana
    // Metode trzeba gdzies wywolac:
    // W addIngredient i removeIngredient
    // Metoda ta przyjmuje dane (tablice ingredients) aby
    // posiadac ich najbardziej aktualna wersje
}

purchaseHandler = () => {
    if (this.props.isAuthenticated) {
        this.setState({purchasing: true}); 
    } else {
        this.props.onSetAuthRedirectPath('/checkout');
        this.props.history.push('/auth');
    }    
}

purchaseCancelHandler = () => {
    this.setState({purchasing: false});
}

purchaseContinueHandler = () => {
    this.props.onInitPurchase();
    this.props.history.push('/checkout');
}


    render () {
        //-----------------------------------------------
        /*
            Jezeli jakis skladnik wystepuje 0 razy to
            przy nim pojawi sie true czyli miejsce w ktorym
            nastapi wylaczenie sie buttona
            Do BuildControls wysylka tylko tablicy
            bo ona juz zawiera true/false do danych
            skladnikow
            disabled = { props.disabled[ctrl.type] }
            Kazdy przycisk musi pobrac informacje czy 
            musi byc disabled a tablica jaka tam przyszla
            posiada wszystkie skladniki na raz wiec trzeba
            uzyskac w ten sposob info o konkretnym skladniku
        */
        const disabledInfo = {
            ...this.props.ings
        };
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        //-----------------------------------------------
        let orderSummary = null;  
        let burger = this.props.error ? <p>Ingredients cant be loaded</p> : <Spinner />;
        if (this.props.ings) {
            burger = (
                <Aux>
                    <Burger ingredients = { this.props.ings } />
                    <BuildControls ingredientAdded = { this.props.onIngredientAdded } 
                                   ingredientRemoved = { this.props.onIngredientRemoved } 
                                   disabled = { disabledInfo }
                                   purchasable = { this.updatePurchaseState(this.props.ings) } 
                                   price = { this.props.price } 
                                   ordered = { this.purchaseHandler } 
                                   isAuth = { this.props.isAuthenticated } />
                </Aux>
            );     
            orderSummary = <OrderSummary ingredients = { this.props.ings } 
                                         purchaseCancelled = { this.purchaseCancelHandler } 
                                         purchaseContinued = { this.purchaseContinueHandler } 
                                         price = { this.props.price } />;       
        }

        return (
            <Aux>
                <Modal show = { this.state.purchasing } modalClosed = { this.purchaseCancelHandler } >
                        { orderSummary }
                </Modal>
                        { burger }
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    };
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch( actions.addIngredient(ingName) ),
        onIngredientRemoved: (ingName) => dispatch( actions.removeIngredient(ingName) ),
        onInitIngredients: () => dispatch( actions.initIngredients() ),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));

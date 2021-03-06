import React, { Component } from 'react';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Spinner from '../../../components/UI/Spinner/Spinner';
import Input from '../../../components/UI/Input/Input';
import { connect } from 'react-redux';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import * as actions from '../../../store/actions/index';
import { updateObject, checkValidity } from '../../../shared/utility';

/*
    Formularz kontaktowy podmieniony na Spinner, jezeli
    jest oczekiwanie na serwer, po kliknieciu 
    ORDER    
    Nastepnie po otrzymaniu pozytywnej odpowiedzi od serwera,
    nastepuje przekierowanie do innej strony
*/

/*
    Kazdy input bedzie oddzielnym komponentem
    UI/Input
    Input komponent tak dostosowany, zeby wyswietlal 
    odpowiedni element formularza w zaleznosci od tego
    jakie parametry tam zostana wyslane poprzez obiekt
    props
*/

/*
    Wygenerowanie odpowiednich inputow o odpowiednich
    typach poprzez uzycie petli zawierajacej elementy
    obiektu orderForm:
    1. Trzeba przerobic obiekt orderForm w taki sposob, 
    zeby uzyskac tablice.
    2. Kazdy key to jest caly oddzielny obiekt, np.
    street, zipCode, name
    natomiast config jest to prawa strona takiego obiektu,
    np. elementType, value:

    const formElementsArray = [];
    for (let key in this.state.orderForm) {
        formElementsArray.push({
            id: key,
            config: this.state.orderForm[key]
        });
    }

    3. Tak stworzona tablice formElementsArray mozna teraz 
    wykorzystac w petli do tworzenia poszczegolnych inputow:

        { 
        formElementsArray.map(formElement => (
            <Input elementType = { formElement.config.elementType } 
                   elementConfig = { formElement.config.elementConfig } 
                   value = { formElement.config.value } 
                   key = { formElement.id } />
        ))
        }

*/

/*
        Dodanie dropdown menu:
        W Input.js
        korzysta z elementConfig.options
        options musi zostac przemapowane i wtedy mozna
        wyswietlic juz jako pojedynczy element dropdown menu
        Wykorzystujemy do tego displayValue i value danej opcji
        do wyboru
*/

/*
        Przechwytywanie tego co uzytkownik wprowadza:
        Kazdy element Input musi posiadac onChange event listener:
        onChange = { props.changed }
       
       
        Tutaj zostaje to odebrane:
        changed = { this.inputChangedHandler }
        Kazda zmiana w jakims polu powoduje przekazanie tutaj tej
        informacji i dalej przekazanie do inputChangedHandler
       
       
        Formularz musi reagowac takze na wprowadzane zmiany przez
        uzytkownika i update'towac Inputy:
        changed = {(event) => this.inputChangedHandler(event, formElement.id) }
        formElement.id - id danego Input (name, street, itd.)
        event - wartosc
        Te dwie informacji wystarcza zeby z-update'towac poszczegolne
        pole formularza


        Id zostalo przypisane podczas tworzenia tablicy formElementsArray:
        formElementsArray.push({
            id: key,


        
*/

/*
            inputChangedHandler:
    
        Przy takiej konstrukcji obiektu orderForm musimy glebiej przekopiowac
        poszczegolne obiekty w orderForm, aby miec dostep do kopii ich ,,wnetrza"
        a nie do wskaznikow:

        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = { 
            ...updatedOrderForm[inputIdentifier]
        };

        1. kopia calosci orderForm
        2. kopia poszczegolnych elementow (obiektow), np
        name, street
        Wykorzystanie id, jakie pole dokladnie

        Dalej:
        updatedFormElement.value = event.target.value;
        updatedOrderForm[inputIdentifier] = updatedFormElement;  
        
        3. value w danym obiekcie (name, street) przyjmuje wartosc
        wprowadzona przez uzytkownika
        4. Glowna kopia calosci orderForm przyjmuje naniesione poprawki
        z glebszej kopii poszczegolnych obiektow wewnatrz

        Dalej:
        this.setState({ orderForm: updatedOrderForm });

        5. Update oryginalnego obiektu orderForm

*/

/*
        Form Submission:

            <form onSubmit = { this.orderHandler } >

        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ingredients,
            price: this.props.price,
            orderData: formData
        }

        orderData - wartosci poszczegolnych pol z formularza

        obiekt pomocniczy formData
        uzycie petli na obiekcie orderForm
        Zczytanie poszczegolnych wartosci pol 
        Przypisanie ich do formData
*/

/*
        Validation Form:


        1. Kazde pole musi miec zapis, np:
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false

        2. Stworzenie metody sprawdzajacej:
            checkValidity(value, rules) {
                let isValid = false;

                if (rules.required) {
                    isValid = value.trim() !== '';
                }

                return isValid;
            }
        jezeli zasady danego pola posiadaja required = true, to
        sprawdzenie, czy pole posiada co kolwiek wpisanego

        3. W metodzie nasluchujacej zmian w formularzu:
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        przekazanie do metody sprawdzajacej obecnej wartosci pola oraz jego
        indywidualnych zasad

        4. Metoda checkValidity zwraca ostatecznie true/false

        5. Mozemy dalej dodawac jakies sprawdzanie np:
        if (rules.minLength) {
            isValid = value.length >= rules.minLength;
        }

        if (rules.maxLength) {
            isValid = value.length <= rules.maxLength;
        }
*/

/*
        Metoda do sprawdzania poprawnosci pol formularza posiada
        jedno sprawdzenie za drugim, wiec tylko ostatnie zwroci
        ostateczna wartosc pomimo, ze np. wczesniejsze byly na false

        W kazdym sprawdzeniu, sprawdzenie, czy juz wartosc isValid = true
        && isValid
*/

/*
        Dodanie komunikatu w Input.js, jezeli dane pole nie jest
        poprawnie uzupelnione

        Stworzenie dynamicznego tworzenia sie klasy CSS:
        className = { inputClasses.join(' ') }
        Do kazdego typu pola


        Stworzenie tablicy:
        const inputClasses = [ classes.InputElement ];

        Jezeli pole nie jest poprawne, to na samym poczatku sprawdzenie:
        if (props.invalid && props.shouldValidate) {
            inputClasses.push(classes.Invalid);
        }
        Dopisanie klasy CSS


        Niektore typy pol, takie jak np. dropdown menu, nie powinny
        byc sprawdzane, przeciez zawsze jest wybrana jakas wartosc, wiec
        if statement posiada dopisek && props.shouldValidate

        shouldValidate przekazuje true, jezeli dane pole (obiekt)
        posiada validation
*/

/*
        Sprawdzenie danego pola, tylko, gdy uzytkownik klikna/zacza pisac
        Dodanie do obiektow pol:
        touched: false

        Nastepnie w metodzie przechwytujacej kazde wpisanie czegos:
        updatedFormElement.touched = true;
        Uzytkownik zacza cos pisac wiec = true teraz

        Przekazanie tej informacji do Input component:
        touched = { formElement.config.touched } 

        W Input.js IF STATEMENT dopisanie:
         && props.touched
*/


/*
        Button ORDER musi dzialac tylko wtedy, gdy
        caly formularz jest poprawny:

        1. Dopisanie poza calym obiektem orderForm:
                formIsValid: false,
        
        2. W metodzie, ktora reaguje na kazde wpisanie czegos:
        sprawdzenie, czy wszystkie obiekty (name, street, itd) posiadaja
        valid = true, dlatego wybranie glownej kopii calego obiektu
        orderForm i sprawdzenie kazdego obiektu:

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        3. Aktualizacja glownego state aplikacji:
        formIsValid: formIsValid 
        
        4. Dostosowanie Buttona:
        disabled = { !this.state.formIsValid } 

        5. Button to nasz komponent, wiec disabled trzeba tam dodac
*/
class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true,
                    isEmail: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [ 
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest',
                validation: {},
                valid: true
            }
        },
        formIsValid: false
    }

    orderHandler = (event) => {
        console.log(this.props.ingredients);
        event.preventDefault();
        const formData = {};
        for (let formElementIdentifier in this.state.orderForm) {
            formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData,
            userId: this.props.userId
        }
        
        this.props.onOrderBurger(order, this.props.token);
    }

    inputChangedHandler = (event, inputIdentifier) => {

        const updatedFormElement = updateObject(this.state.orderForm[inputIdentifier], {
            value: event.target.value,
            valid: checkValidity(event.target.value, this.state.orderForm[inputIdentifier].validation),
            touched: true
        });
        const updatedOrderForm = updateObject(this.state.orderForm, {
            [inputIdentifier]: updatedFormElement
        });

        let formIsValid = true;
        for (let inputIdentifier in updatedOrderForm) {
            formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
        }

        this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    }

    render() {
    const formElementsArray = [];
    for (let key in this.state.orderForm) {
        formElementsArray.push({
            id: key,
            config: this.state.orderForm[key]
        });
    }

        let form = (
                <form onSubmit = { this.orderHandler } >
                    { 
                    formElementsArray.map(formElement => (
                        <Input elementType = { formElement.config.elementType } 
                               elementConfig = { formElement.config.elementConfig } 
                               value = { formElement.config.value } 
                               key = { formElement.id } 
                               changed = {(event) => this.inputChangedHandler(event, formElement.id) } 
                               invalid = { !formElement.config.valid } 
                               shouldValidate = { formElement.config.validation } 
                               touched = { formElement.config.touched } />
                    ))
                    }
                    <Button btnType = "Success"
                            disabled = { !this.state.formIsValid } > 
                            ORDER
                    </Button>

                </form>
        );
        if (this.props.loading) {
            form = <Spinner />;
        }
        return (
            <div className = { classes.ContactData } >
                <h4>Enter your Contact Data</h4>
                { form }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));

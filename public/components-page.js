const componentSearch =
    document.getElementById("componentSearch");

const sortComponents =
    document.getElementById("sortComponents");

const categoryFilters =
    document.getElementById("categoryFilters");

const componentLibraryGrid =
    document.getElementById("componentLibraryGrid");

const libraryCount =
    document.getElementById("libraryCount");

const libraryStatus =
    document.getElementById("libraryStatus");

const libraryEmpty =
    document.getElementById("libraryEmpty");

const componentDialog =
    document.getElementById("componentDialog");

const closeDialog =
    document.getElementById("closeDialog");

const dialogName =
    document.getElementById("dialogName");

const dialogCategory =
    document.getElementById("dialogCategory");

const dialogContent =
    document.getElementById("dialogContent");


let allComponents = [];

let activeCategory = "All";


/* =========================================
   START
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadComponents();

    }
);


/* =========================================
   LOAD COMPONENTS FROM SQLITE API
========================================= */

async function loadComponents() {

    try {

        libraryStatus.textContent =
            "Loading component database...";


        const response =
            await fetch("/api/components");


        if (!response.ok) {

            throw new Error(
                "API returned status " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "API DATA:",
            data
        );


        if (
            !data.success ||
            !Array.isArray(data.components)
        ) {

            throw new Error(
                "Invalid component data received"
            );

        }


        allComponents =
            data.components;


        console.log(
            "Loaded components:",
            allComponents.length
        );


        createCategoryFilters();

        renderComponents();


        libraryStatus.textContent =
            "Browse the CircuitCraft electronics database.";

    }

    catch (error) {

        console.error(
            "Component loading error:",
            error
        );


        libraryStatus.textContent =
            "Failed to load component database.";


        componentLibraryGrid.innerHTML = `

            <div class="library-error">

                ⚠ Unable to load components.

                Check whether
                /api/components
                is working.

            </div>

        `;

    }

}


/* =========================================
   CATEGORY FILTERS
========================================= */

function createCategoryFilters() {

    categoryFilters.innerHTML = "";


    const categories = [

        "All",

        ...new Set(

            allComponents.map(
                component =>
                    component.category
            )

        )

    ];


    categories.forEach(
        function (category) {

            const button =
                document.createElement(
                    "button"
                );


            button.className =
                "category-filter";


            button.textContent =
                category;


            if (
                category === "All"
            ) {

                button.classList.add(
                    "active"
                );

            }


            button.addEventListener(
                "click",
                function () {

                    activeCategory =
                        category;


                    document
                        .querySelectorAll(
                            ".category-filter"
                        )
                        .forEach(
                            button =>

                                button.classList.remove(
                                    "active"
                                )

                        );


                    button.classList.add(
                        "active"
                    );


                    renderComponents();

                }
            );


            categoryFilters.appendChild(
                button
            );

        }
    );

}


/* =========================================
   SEARCH + SORT EVENTS
========================================= */

componentSearch.addEventListener(
    "input",
    renderComponents
);


sortComponents.addEventListener(
    "change",
    renderComponents
);


/* =========================================
   FILTER COMPONENTS
========================================= */

function getFilteredComponents() {

    const searchText =
        componentSearch
            .value
            .toLowerCase()
            .trim();


    let filtered =
        allComponents.filter(
            function (component) {

                const matchesCategory =

                    activeCategory === "All"

                    ||

                    component.category ===
                    activeCategory;


                const searchableText = `

                    ${component.name}

                    ${component.category}

                    ${component.purpose || ""}

                    ${component.operatingVoltage || ""}

                    ${component.communication || ""}

                `.toLowerCase();


                const matchesSearch =

                    searchText === ""

                    ||

                    searchableText.includes(
                        searchText
                    );


                return (
                    matchesCategory &&
                    matchesSearch
                );

            }
        );


    const sort =
        sortComponents.value;


    if (
        sort === "name"
    ) {

        filtered.sort(
            (a, b) =>
                a.name.localeCompare(
                    b.name
                )
        );

    }


    else if (
        sort === "price-low"
    ) {

        filtered.sort(
            (a, b) =>
                a.price - b.price
        );

    }


    else if (
        sort === "price-high"
    ) {

        filtered.sort(
            (a, b) =>
                b.price - a.price
        );

    }


    else if (
        sort === "category"
    ) {

        filtered.sort(
            (a, b) =>

                a.category.localeCompare(
                    b.category
                )

                ||

                a.name.localeCompare(
                    b.name
                )

        );

    }


    return filtered;

}


/* =========================================
   RENDER CARDS
========================================= */

function renderComponents() {

    const components =
        getFilteredComponents();


    componentLibraryGrid.innerHTML =
        "";


    libraryCount.textContent =

        components.length +

        (
            components.length === 1
                ? " component"
                : " components"
        );


    if (
        components.length === 0
    ) {

        libraryEmpty.style.display =
            "block";

        return;

    }


    libraryEmpty.style.display =
        "none";


    components.forEach(
        function (component) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "library-card";


            const voltage =

                component.operatingVoltage

                ||

                component.inputVoltage

                ||

                component.voltage

                ||

                "Not specified";


            let interfaceText = "—";


            const interfaces = [];


            if (
                component.wifi
            ) {

                interfaces.push(
                    "Wi-Fi"
                );

            }


            if (
                component.bluetooth
            ) {

                interfaces.push(
                    "Bluetooth"
                );

            }


            if (
                component.communication
            ) {

                interfaces.push(
                    component.communication
                );

            }


            if (
                interfaces.length > 0
            ) {

                interfaceText =
                    interfaces.join(", ");

            }


            const warningHTML =

                component.warning

                    ? `

                        <div class="library-warning">

                            ⚠ Wiring note available

                        </div>

                    `

                    : "";


            card.innerHTML = `

                <div class="library-card-top">

                    <span class="category-tag">

                        ${component.category}

                    </span>


                    <strong class="library-price">

                        ₹${component.price}

                    </strong>

                </div>


                <h3>

                    ${component.name}

                </h3>


                <p class="library-purpose">

                    ${
                        component.purpose
                        ||
                        "No description available."
                    }

                </p>


                <div class="library-specs">


                    <div>

                        <span>
                            Voltage
                        </span>

                        <strong>
                            ${voltage}
                        </strong>

                    </div>


                    <div>

                        <span>
                            Interface
                        </span>

                        <strong>
                            ${interfaceText}
                        </strong>

                    </div>


                </div>


                ${warningHTML}


                <button
                    class="component-detail-button"
                    data-id="${component.id}"
                >

                    View Details

                </button>

            `;


            componentLibraryGrid
                .appendChild(card);

        }
    );


    addDetailButtonEvents();

}


/* =========================================
   DETAIL BUTTON EVENTS
========================================= */

function addDetailButtonEvents() {

    document
        .querySelectorAll(
            ".component-detail-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        openComponentDetails(
                            button.dataset.id
                        );

                    }
                );

            }
        );

}


/* =========================================
   DETAILS POPUP
========================================= */

function openComponentDetails(
    componentId
) {

    const component =
        allComponents.find(
            component =>
                component.id ===
                componentId
        );


    if (!component) {

        return;

    }


    dialogName.textContent =
        component.name;


    dialogCategory.textContent =
        component.category;


    let specifications = "";


    addSpec(
        "Price",
        "₹" + component.price
    );


    addSpec(
        "Operating Voltage",
        component.operatingVoltage
    );


    addSpec(
        "Input Voltage",
        component.inputVoltage
    );


    addSpec(
        "Motor Voltage",
        component.motorVoltage
    );


    addSpec(
        "GPIO",
        component.gpio
    );


    addSpec(
        "Channels",
        component.channels
    );


    addSpec(
        "Communication",
        component.communication
    );


    if (
        component.wifi
    ) {

        addSpec(
            "Wi-Fi",
            "Yes"
        );

    }


    if (
        component.bluetooth
    ) {

        addSpec(
            "Bluetooth",
            "Yes"
        );

    }


    function addSpec(
        label,
        value
    ) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return;

        }


        specifications += `

            <div class="dialog-spec">

                <span>
                    ${label}
                </span>

                <strong>
                    ${value}
                </strong>

            </div>

        `;

    }


    let warningHTML = "";


    if (
        component.warning
    ) {

        warningHTML = `

            <div class="dialog-warning">

                <strong>
                    ⚠ Important
                </strong>

                <p>
                    ${component.warning}
                </p>

            </div>

        `;

    }


    let alternativesHTML = "";


    if (
        component.alternatives &&
        component.alternatives.length > 0
    ) {

        alternativesHTML = `

            <div class="dialog-section">

                <h4>
                    Alternatives
                </h4>

                <p>

                    ${component.alternatives.join(
                        ", "
                    )}

                </p>

            </div>

        `;

    }


    dialogContent.innerHTML = `

        <div class="dialog-section">

            <h4>
                Purpose
            </h4>

            <p>

                ${
                    component.purpose
                    ||
                    "Not specified"
                }

            </p>

        </div>


        <div class="dialog-spec-grid">

            ${specifications}

        </div>


        ${warningHTML}


        ${alternativesHTML}


        <div class="dialog-note">

            Verify the exact manufacturer's
            datasheet before final circuit
            design.

        </div>

    `;


    componentDialog.showModal();

}


/* =========================================
   CLOSE POPUP
========================================= */

closeDialog.addEventListener(
    "click",
    function () {

        componentDialog.close();

    }
);


componentDialog.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            componentDialog
        ) {

            componentDialog.close();

        }

    }
);
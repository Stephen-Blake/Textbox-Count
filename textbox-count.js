const errorMixin = {
	errors: {
		 total: function total( data ) {
			const { value, element } = data;
			if(value.value > this.total){
				value.classList.add('redBox'); value.value = '';
				return 'error';
			}
		},
		elementTotal: function elementTotal( data ) {
			const { value, element } = data;
			if(this.count > this.total){
				value.classList.add('redBox'); value.value = '';
				return 'error';
			}
		},
		isNaN: function elementTotal( data ) {
			const { value, element } = data;
			if(isNaN(value)){
				value.classList.add('redBox'); value.value = '';
				return 'error';
			}
		},
	}
};

class textBoxCount {

  itemCount = 0;
  elements = [];
  countElement;
  count = 0;
	total = 0;
	erroring;

  constructor( data ) {
		const { elements, count, total } = data;
    this.elements = elements;
    this.countElement = count;
		this.total = total;
		this.erroring = Object.assign(this, errorMixin);
    this.#init();
  }

  #init = () => {

    this.#loop(
      this.#loopIndex
    );

  }

  #loop = ( loopFunction ) => {

    for (let i = 0; i < this.elements.length; i++) {
      loopFunction(i);
    }

  }

  #loopIndex = ( i ) => {

    this.elements[i].addEventListener('keyup', e => {

      this.count = 0;

      this.#loop(
        this.#loopValue
      );

			// Returns a promise
			this.#errors.call(this, i)
				.then(
					() => this.countElement.innerText = this.count
				)
				.catch(
					() => console.warn('error')
				);

    });

  }

  #loopValue = ( i ) => {

		this.elements[i].classList.remove('redBox');

    if(!this.elements[i].value){
      return;
    }

    this.count = this.count + parseInt(this.elements[i].value);

  }

	#errors = async ( i ) => {

		let errorPromise = new Promise((resolve, reject) => {

			for (const errorIndex in this.erroring.errors) {

				let error = this.erroring.errors[errorIndex].call(this,
					{
						value: this.elements[i],
						element: this.countElement
					}
				);

				if(error){
					reject();
				}

			}

			resolve();

		});

		return await errorPromise;

	}

}

window.onload = () => {

	var	items = [
		{
			elements: document.querySelectorAll(".tshirt_text"),
			count: document.querySelector('#tshirt_count'),
			total: <?php echo $TshirtCount; ?>
		},
		{
			elements: document.querySelectorAll(".polo_text"),
			count: document.querySelector('#polo_count'),
			total: <?php echo $PoloCount; ?>
		},
		{
			elements: document.querySelectorAll(".hoodie_text"),
			count: document.querySelector('#hoodies_count'),
			total: <?php echo $HoodieCount; ?>
		},
		{
			elements: document.querySelectorAll(".softshell_text"),
			count: document.querySelector('#softshell_count'),
			total: <?php echo $SoftshellCount; ?>
		},
	];

	items.forEach((item, i) => {
		new textBoxCount(
			item
		);
	});

};

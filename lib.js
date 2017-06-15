
         /*
          Проверить наличие всех данных и разблокироваь кнопки
         */
        function checkReadiness(config = {}) {
          if (!config.alpha || !config.beta || !config.timeRestriction) {
            return blockAllButtons();
          }

          return enableAllButtons();
        }

        /*
         Заблокировать все кнопки
         */
        function blockAllButtons() {
          let buttons = document.querySelectorAll('button.disebable');
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].addClass('disable')
          }
        }

        /*
         Разблокировать все кнопки
         */
        function enableAllButtons() {
          let buttons = document.querySelectorAll('button.disebable');
          for (let i = 0; i < buttons.length; i++) {
            buttons[i].removeClass('enable')
          }
        }

        /*
         Получить информацию об ограничении во времени и параметрах
         */
        function getModelConfiguration() {
          let timeRestriction = (document.querySelector('input#wage') || {}).value;
          let alpha = (document.querySelector('input#alpha') || {}).value;
          let beta = (document.querySelector('input#beta') || {}).value;

          return {
            timeRestriction, alpha, beta
          }
        }

        /*
          Получить конфигурацию об обязательных и исключенных концептах
         */
        function getConceptsConfiguration(options = {}) {
          let excludedIds = [];
          let includedIds = [];

          let inputs = document.querySelectorAll('select.concept-configuration');

          for (let i = 0; i < inputs.length; i++) {
            let id = (inputs[i].id.match(/\d+/g) || [])[0];

            if (!id) {
              console.error('Id is not found in select: ' + inputs[i].id);
              return null;
            }

            let val = inputs[i].id.value && inputs[i].id.value.toLowerCase();

            switch (val) {
              case 'include':
                includedIds.push(id);
                break;
              case 'exclude':
                excludedIds.push(id);
                break;
            }
          }

          return { includedIds, excludedIds };
        }

         /*
          Запустить алгоритм поиска оптимальной модели курса
          */
        function runCalculation() {
          // TODO: Возможно проверить на ошибки и вызвать setError(err)?

          console.time('Calculation')

          try {
            // TODO: run algorithm
            // TODO: solve for each set
          } catch (e) {
            setError(e)
          }

          let value = 100;

          console.timeEnd('Calculation')

          setResultedValue(100);
        }

         /*
          Вывести информаци об ошибке клиенту
          */
         function setError(errors = []) {
           if (!Array.isArray(errors)) errors = [errors];

           let notificationDiv = (document.querySelector('input#beta') || {});
           let message = '';

           for (let i = 0; i < errors.length; i++) {
             message += error[i].message + '   \n';
           }

           notificationDiv.innerHTML = message;
         }

         /*
          Установить результирующее значение в форме
          */
        function setResultedValue(value = 0) {
          return (document.querySelector('input#beta') || {}).value = value;
        }

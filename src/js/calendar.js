Number.prototype.pad = function(num) {
    var str = '';
    for(var i = 0; i < (num - this.toString().length); i++) str += '0';
    return str += this.toString();
}

function Calendar(widget, data, onclick) {
    var self = this;

    this.months = [
        'Январь',
        'Февраль',
        'Март',
        'Апрель',
        'Май',
        'Июнь',
        'Июль',
        'Август',
        'Сентябрь',
        'Октябрь',
        'Ноябрь',
        'Декабрь'
    ];

    this.days_abr = [
        'Вс',
        'Пн',
        'Вт',
        'Ср',
        'Чт',
        'Пт',
        'Сб'
    ];

    this.construct = function() {
        var self = this;
        var original = widget.getElementsByClassName('active')[0];
        var selected = false;
        var now = new Date();

        if (typeof original === 'undefined') {
            var month_div = document.createElement('div');
            month_div.className = 'month';
            widget.appendChild(month_div);

            original = document.createElement('table');
            original.setAttribute('data-actual',
                      data.getFullYear() + '/' +
                      data.getMonth().pad(2) + '/' +
                      data.getDate().pad(2));
            widget.appendChild(original);

        } else {
            var month_div = widget.getElementsByClassName('month')[0];
            month_div.innerHTML = '';
        }

        var diff = data - new Date(original.getAttribute('data-actual'));

        diff = new Date(diff).getMonth();

        var table = document.createElement('table');

        table.className = diff === 0 ? 'to-left' : 'to-right';
        table.innerHTML = '';

        table.setAttribute('data-actual',
                       data.getFullYear() + '/' +
                       data.getMonth().pad(2) + '/' +
                       data.getDate().pad(2))

        var heading = document.createElement('div');
        heading.className = 'heading';

        var btn_prev = document.createElement('button');
        btn_prev.className = 'btn-prev';
        btn_prev.innerHTML = '&#9666;';

        var btn_next = document.createElement('button');
        btn_next.className = 'btn-next';
        btn_next.innerHTML = '&#9656;';

        heading.innerHTML = self.months[data.getMonth()] + ' ' + data.getFullYear();
        month_div.appendChild(heading);
        month_div.appendChild(btn_prev);
        month_div.appendChild(btn_next);

        btn_prev.onclick = function(e) {
            e.preventDefault();
            data.setMonth(data.getMonth() - 1);
            Calendar(widget, data);
        };

        btn_next.onclick = function(e) {
            e.preventDefault();
            data.setMonth(data.getMonth() + 1);
            Calendar(widget, data);
        };

        widget.appendChild(month_div);
        widget.appendChild(table);

        var row = document.createElement('tr');
        for(var i = 1; i < 7; i++) {
            row.innerHTML += '<th>' + self.days_abr[i] + '</th>';
        }
        row.innerHTML += '<th>' + self.days_abr[0] + '</th>';
        table.appendChild(row);

        var monthBegin = new Date(data.getFullYear(), data.getMonth(), -1).getDay();

        var actual = new Date(data.getFullYear(),
                  data.getMonth(),
                  -monthBegin);

        for (var s = 0; s < 6; s++) {
            var row = document.createElement('tr');

            for (var d = 1; d < 8; d++) {
                var cell = document.createElement('td');
                var span = document.createElement('span');

                cell.appendChild(span);

                span.innerHTML = actual.getDate();

                if(actual.getMonth() !== data.getMonth())
                    cell.className = 'inact';
                else {
                    cell.addEventListener('click', function() {
                        if (selected !== false) selected.classList.remove('selected');
                        this.classList.add('selected');
                        selected = this;
                    });
                    cell.addEventListener('click', onclick);    
                }

                //if(data.getDate() == actual.getDate() && data.getMonth() == actual.getMonth())
                //    cell.className = 'curr';
                if(now.getDate() == actual.getDate() && now.getMonth() == actual.getMonth() && now.getFullYear() == actual.getFullYear())
                    cell.className = 'curr';

                cell.setAttribute('data-date',
                      actual.getFullYear() + '-' +
                      actual.getMonth() + '-' +
                      actual.getDate());

                actual.setDate(actual.getDate() + 1);
                row.appendChild(cell);
            }

            table.appendChild(row);
        }

        setTimeout(function() {
            table.className = 'active';
            original.className += diff === 0 ? ' to-right' : ' to-left';
        }, 20);

        original.className = 'inactive';

        setTimeout(function() {
            var inactives = document.getElementsByClassName('inactive');
            for (var i = 0; i < inactives.length; i++)
                widget.removeChild(inactives[i]);
        }, 1000);
    }

    this.construct();
}
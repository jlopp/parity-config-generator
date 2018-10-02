import React, { Component, PropTypes } from 'react';

import './Presets.css';

import Select from '../controls/Select';
import Item from '../Item';

import mining from './mining.json';
import ports from './ports.json';
import bandwidth from './bandwidth.json';
import pruned from './pruned.json';
import pi from './pi.json';
import tor from './tor.json';
import testnet from './testnet.json';
import regtest from './regtest.json';
import nosync from './nosync.json';
import lightningeclair from './lightningeclair.json';

function toVal (val) {
  return { name: val, value: val };
}

// Determine which value to use, the default (a) or non-default (b)
function mix (a, b) {
  if (typeof a !== 'object' || typeof b !== 'object') {
    if (b !== undefined) {
      return b;
    }
    return b || a;
  }

  Object.keys(a).forEach(key => {
    a[key] = mix(a[key], b[key]);
  });

  return a;
}

const presets = {
  'Defaults': {},
  'Mining': mining,
  'Non-standard Ports': ports,
  'Low Bandwidth': bandwidth,
  'Low Disk Usage': pruned,
  'Raspberry Pi': pi,
  'Privacy': tor,
  'Testnet': testnet,
  'Regtest': regtest,
  'Non-syncing': nosync,
  'Lightning-eclair': lightningeclair
};

class Presets extends Component {
  static propTypes = {
    preset: PropTypes.string,
    defaults: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  static defaultProps = {
    preset: 'Defaults'
  };

  change = (preset) => {
    if (!window.confirm('Do you want to overwrite current config?')) {
      this.forceUpdate();
      return;
    }

    const data = mix(clone(this.props.defaults), clone(presets[preset] || {}));
    this.props.onChange(preset, data);
  };

  render () {
    const {preset} = this.props;

    return (
      <div className='presets'>
        <Item title={''} description={'Load predefined config.'}>
          <Select
            onChange={this.change}
            value={preset}
            values={Object.keys(presets).map(toVal)}
            id={'presets'}
            disabled={false}
          />
        </Item>
      </div>
    );
  }
}

function clone (val) {
  return JSON.parse(JSON.stringify(val));
}

export default Presets;

import {expect} from 'chai';
import {mount}  from '@vue/test-utils';

import  Counter  from '@/components/Counter';

describe("测试counter组件",()=>{
	it("测试点击按钮+1",()=>{
		let wrapper = mount(Counter);
		expect(wrapper.find('#count').text()).to.be.equal('10');
		wrapper.find("button").trigger("click");
		expect(wrapper.find("#count").text()).to.be.equal('11');
	})
})
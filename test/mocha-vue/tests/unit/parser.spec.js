import {parser,stringify} from '@/code/parser';
import { expect } from 'chai';

// 测试方法

// 常见的关系  相等 大于/小于  包含和不包含

// it表示一个用例

describe('专门测试parser',()=>{
	it('测试parser',()=>{
		// to.be   xxx 表示断言
		// deep.equal  表示两个对象是否相等(不考虑引用空间)
		expect(parser('name=chance')).to.be.deep.equal({name:'chance'})
	})
})

describe('专门测试stringify',()=>{
	it('测试stringify',()=>{
		expect(stringify({name:'chance'})).to.be.equal('name=chance');
	})
})

describe('测试方法',()=>{
	it('相等关系',()=>{
		expect(1+1).to.be.equal(2);
		expect([1,2,3]).to.be.lengthOf(3);
		expect(true).to.be.true;
	});
	
	it('包含',()=>{
		expect('zfpx').to.be.contain('zf');
		expect('zfpx').to.be.match(/zf/);
		
	});
	
	it("大于 小于",()=>{
		expect(5).to.be.greaterThan(3);   //大于
		expect(5).to.be.lessThan(6);      //小于
	    expect(5).to.be.not.greaterThan(10);  //不大于
	});
	
})
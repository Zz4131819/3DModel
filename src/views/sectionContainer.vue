<template>
    <div>
        <section>
            <div class="box1"></div>
        </section>
        <section>
            <div class="box2"></div>
        </section>
        <section>
            <div class="box3"></div>
        </section>
    </div>
</template>

<script>
export default {

}
</script>

<style>
div {
	overflow: auto;
	scroll-snap-type: y proximity;
	height: 100vh;
    width: 100vw;
}
section {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
    scroll-snap-stop: always;
	scroll-snap-align: start;
	overflow: hidden;
}
.box1{
    background-color: #e04141;
}
.box2{
    background-color: #4cf836;
}
.box3{
    background-color: #0f27fd;
}
</style>